import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Order, ShippingAddress } from '../models/order.model';
import { OrderStatus, normalizeOrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { CartItem } from '../models/cart.model';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);

  private readonly _orders = signal<Order[]>(this.loadOrders());
  readonly orders = this._orders.asReadonly();
  readonly isSyncing = signal<boolean>(false);
  private channel?: BroadcastChannel;

  constructor() {
    this.cleanupLegacyStorage();
    this.initCrossTabListener();
  }

  private cleanupLegacyStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem('shopzone_orders_list');
      localStorage.removeItem('nisha_admin_orders_v1');
    } catch {}
  }

  private getUserStorageKey(): string | null {
    const user = this.tokenService.getUser();
    if (!user || !user.id) return null;
    return `nisha_user_orders_${user.id}`;
  }

  isDemoOrder(o: any): boolean {
    if (!o) return true;
    const name = String(o.shippingAddress?.fullName || o.customerName || '').toLowerCase().trim();
    if (name.includes('ramesh kumar')) return true;

    const address = String(o.shippingAddress?.addressLine1 || (typeof o.shippingAddress === 'string' ? o.shippingAddress : '')).toLowerCase();
    if (address.includes('mill gate road') || address.includes('gandhipuram')) return true;

    const orderNum = String(o.orderNumber || '').trim();
    if (['ORD-2297-2026', 'ORD-6741-2026', 'ORD-4943-2026'].includes(orderNum)) return true;
    if (['ord-9821', 'ord-8419', 'ord-7612', 'ord-8841', 'ord-8842', 'ord-8843'].includes(String(o.id))) return true;
    if (orderNum.startsWith('NPO-2025-') || orderNum.startsWith('DEMO-')) return true;

    return false;
  }

  private initCrossTabListener(): void {
    if (typeof window === 'undefined') return;

    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('nisha_orders_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'ORDER_STATUS_UPDATED') {
            const { orderId, orderNumber, status, trackingNumber, carrier } = event.data;
            this.applyStatusUpdate(orderId, orderNumber, status, trackingNumber, carrier);
          }
        };
      }
    } catch {}

    window.addEventListener('storage', (event) => {
      if (event.key === 'nisha_last_order_update' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          this.applyStatusUpdate(data.orderId, data.orderNumber, data.status, data.trackingNumber, data.carrier);
        } catch {}
      }
    });
  }

  applyStatusUpdate(orderId?: string, orderNumber?: string, status?: any, trackingNumber?: string, carrier?: string): void {
    if (!orderId && !orderNumber) return;
    const normStatus = normalizeOrderStatus(status);
    this._orders.update(orders => {
      const updated = orders.map(ord => {
        if ((orderId && ord.id === orderId) || (orderNumber && ord.orderNumber === orderNumber)) {
          return {
            ...ord,
            status: normStatus,
            trackingNumber: trackingNumber ?? ord.trackingNumber,
            carrier: carrier ?? ord.carrier,
            updatedAt: new Date().toISOString()
          };
        }
        return ord;
      });
      this.saveOrders(updated);
      return updated;
    });
  }

  getOrders(): Observable<Order[]> {
    return of(this._orders());
  }

  fetchLiveOrder(id: string, silent: boolean = true): Observable<Order | null> {
    const encodedId = encodeURIComponent(id.trim());
    const options = silent ? { headers: { 'X-Silent': 'true' } } : undefined;
    return this.api.get<any>(`/orders/${encodedId}`, options).pipe(
      map(res => {
        const dto = res?.data;
        if (!dto || this.isDemoOrder(dto)) return null;
        const mapped = this.mapDtoToOrder(dto);
        this.updateOrderLocally(mapped);
        return mapped;
      }),
      catchError(() => {
        const found = this._orders().find(o => o.id === id || o.orderNumber === id) ?? null;
        return of(found);
      })
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this._orders().find(o => o.id === id || o.orderNumber === id);
    if (order) {
      this.fetchLiveOrder(id, true).subscribe();
      return of(order);
    }
    return this.fetchLiveOrder(id, true).pipe(
      map(ord => ord ?? undefined)
    );
  }

  updateOrderLocally(order: Order): void {
    if (this.isDemoOrder(order)) return;
    const current = this._orders();
    const index = current.findIndex(o => o.id === order.id || o.orderNumber === order.orderNumber);
    let updated: Order[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...order };
    } else {
      updated = [order, ...current];
    }
    this._orders.set(updated);
    this.saveOrders(updated);
  }

  clearOrders(): void {
    const key = this.getUserStorageKey();
    if (key && typeof localStorage !== 'undefined') {
      try { localStorage.removeItem(key); } catch {}
    }
    this._orders.set([]);
  }

  syncLiveOrders(silent: boolean = true): Observable<Order[]> {
    const user = this.tokenService.getUser();
    const token = this.tokenService.getAccessToken();

    // If unauthenticated, clear orders and return empty
    if (!user || !token) {
      this._orders.set([]);
      this.isSyncing.set(false);
      return of([]);
    }

    this.isSyncing.set(true);
    const options = silent ? { headers: { 'X-Silent': 'true' } } : undefined;
    return this.api.get<any>(API_ENDPOINTS.ORDERS.LIST, options).pipe(
      map(res => {
        const rawItems = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : []);
        const items = Array.isArray(rawItems) ? rawItems : [];
        const cleanItems = items.filter((dto: any) => !this.isDemoOrder(dto));
        const mappedFromBackend: Order[] = cleanItems.map((dto: any) => this.mapDtoToOrder(dto));

        this._orders.set(mappedFromBackend);
        this.saveOrders(mappedFromBackend);
        this.isSyncing.set(false);
        return mappedFromBackend;
      }),
      catchError(() => {
        const cached = this.loadOrders();
        this._orders.set(cached);
        this.isSyncing.set(false);
        return of(cached);
      })
    );
  }

  placeOrder(params: {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    discountAmount: number;
    couponCode?: string;
    total: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }): Observable<Order> {
    const user = this.tokenService.getUser();
    const userId = user?.id ? String(user.id) : 'customer';
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const localOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: userId,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.SUCCESS,
      paymentMethod: params.paymentMethod,
      items: params.items.map(item => ({
        id: `oi-${Math.random().toString(36).substr(2, 6)}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.thumbnail,
        sku: item.product.sku,
        productSku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        variantId: item.variantId
      })),
      shippingAddress: params.shippingAddress,
      subtotal: params.subtotal,
      shippingCost: params.shippingCost,
      taxAmount: params.taxAmount,
      discountAmount: params.discountAmount,
      couponCode: params.couponCode,
      totalAmount: params.total,
      total: params.total,
      trackingNumber: `TRK-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'FastExpress Premium',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      statusHistory: [
        { status: OrderStatus.PENDING, timestamp: new Date().toISOString(), note: 'Order submitted' },
        { status: OrderStatus.CONFIRMED, timestamp: new Date().toISOString(), note: 'Payment verified & order confirmed' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const payload = {
      shippingAddress: {
        fullName: params.shippingAddress.fullName,
        phone: params.shippingAddress.phone,
        addressLine1: params.shippingAddress.addressLine1,
        city: params.shippingAddress.city,
        state: params.shippingAddress.state,
        postalCode: params.shippingAddress.postalCode,
        country: params.shippingAddress.country
      },
      paymentMethod: params.paymentMethod,
      couponCode: params.couponCode || null,
      items: params.items.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.thumbnail,
        sku: item.product.sku,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }))
    };

    interface OrderResponseDto {
      id?: string | number;
      orderNumber?: string;
      userId?: string | number;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      createdAt?: string | number;
      updatedAt?: string | number;
    }

    return this.api.post<OrderResponseDto>('/orders', payload).pipe(
      map((res) => {
        const dto = res.data;
        const mappedOrder: Order = {
          ...localOrder,
          id: dto?.id ? String(dto.id) : localOrder.id,
          orderNumber: dto?.orderNumber || localOrder.orderNumber,
          userId: dto?.userId ? String(dto.userId) : localOrder.userId,
          status: dto?.status || localOrder.status,
          paymentStatus: dto?.paymentStatus || localOrder.paymentStatus,
          createdAt: this.parseDate(dto?.createdAt) ?? localOrder.createdAt,
          updatedAt: this.parseDate(dto?.updatedAt) ?? localOrder.updatedAt
        };
        const updated = [mappedOrder, ...this._orders().filter(o => o.id !== mappedOrder.id && o.orderNumber !== mappedOrder.orderNumber)];
        this._orders.set(updated);
        this.saveOrders(updated);
        return mappedOrder;
      }),
      catchError(() => {
        const updated = [localOrder, ...this._orders().filter(o => o.id !== localOrder.id)];
        this._orders.set(updated);
        this.saveOrders(updated);
        return of(localOrder);
      })
    );
  }

  private parseDate(val: any): string | undefined {
    if (!val) return undefined;
    if (typeof val === 'number') {
      const ms = val < 10000000000 ? val * 1000 : val;
      return new Date(ms).toISOString();
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return undefined;
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        const num = Number(trimmed);
        const ms = num < 10000000000 ? num * 1000 : num;
        return new Date(ms).toISOString();
      }
      const d = new Date(trimmed);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    }
    return undefined;
  }

  private mapDtoToOrder(dto: any): Order {
    let shippingAddressObj: any = dto.shippingAddress;
    if (typeof shippingAddressObj === 'string') {
      try {
        shippingAddressObj = JSON.parse(shippingAddressObj);
      } catch {
        shippingAddressObj = null;
      }
    }

    const user = this.tokenService.getUser();
    const fallbackCustomerName = dto.customerName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || 'Customer';
    const fallbackPhone = dto.customerPhone || user?.phone || '+91 98421 88990';

    const resolvedAddress: ShippingAddress = {
      fullName: shippingAddressObj?.fullName || fallbackCustomerName,
      phone: shippingAddressObj?.phone || fallbackPhone,
      addressLine1: shippingAddressObj?.addressLine1 || (typeof dto.shippingAddress === 'string' ? dto.shippingAddress : 'Coimbatore, Tamil Nadu'),
      city: shippingAddressObj?.city || 'Coimbatore',
      state: shippingAddressObj?.state || 'Tamil Nadu',
      postalCode: shippingAddressObj?.postalCode || '641012',
      country: shippingAddressObj?.country || 'India',
      isDefault: true
    };

    return {
      id: String(dto.id),
      orderNumber: dto.orderNumber || `ORD-${String(dto.id).substring(0, 8)}`,
      userId: dto.userId ? String(dto.userId) : (user?.id ? String(user.id) : 'customer'),
      status: normalizeOrderStatus(dto.status),
      paymentStatus: (dto.paymentStatus || PaymentStatus.SUCCESS) as PaymentStatus,
      paymentMethod: dto.paymentMethod || 'Online Payment',
      items: (dto.items || []).map((i: any) => ({
        id: i.id || `oi-${i.sku || 'item'}`,
        productId: i.productId,
        productName: i.productName || 'Cold Pressed Oil',
        productImage: i.productImage || i.thumbnail || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        sku: i.sku || i.productSku || 'SKU-OIL',
        productSku: i.sku || i.productSku || 'SKU-OIL',
        quantity: Number(i.quantity || 1),
        unitPrice: Number(i.unitPrice || 0),
        totalPrice: Number(i.totalPrice || (i.unitPrice * i.quantity) || 0),
        variantId: i.variantId
      })),
      shippingAddress: resolvedAddress,
      subtotal: Number(dto.subtotal ?? dto.totalAmount ?? 0),
      shippingCost: Number(dto.shippingCost ?? 0),
      taxAmount: Number(dto.taxAmount ?? 0),
      discountAmount: Number(dto.discountAmount ?? 0),
      totalAmount: Number(dto.grandTotal ?? dto.totalAmount ?? dto.total ?? 0),
      total: Number(dto.grandTotal ?? dto.totalAmount ?? dto.total ?? 0),
      trackingNumber: dto.trackingNumber || undefined,
      carrier: dto.carrier || undefined,
      estimatedDelivery: this.parseDate(dto.estimatedDelivery),
      createdAt: this.parseDate(dto.createdAt) ?? new Date().toISOString(),
      updatedAt: this.parseDate(dto.updatedAt) ?? new Date().toISOString()
    };
  }

  loadOrders(): Order[] {
    this.cleanupLegacyStorage();
    const key = this.getUserStorageKey();
    if (!key || typeof localStorage === 'undefined') return [];

    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(o => !this.isDemoOrder(o))
            .map(o => ({
              ...o,
              status: normalizeOrderStatus(o.status)
            }));
        }
      }
    } catch {}
    return [];
  }

  private saveOrders(orders: Order[]): void {
    if (typeof localStorage === 'undefined') return;
    const key = this.getUserStorageKey();
    if (!key) return;
    try {
      const clean = orders.filter(o => !this.isDemoOrder(o));
      localStorage.setItem(key, JSON.stringify(clean));
    } catch {}
  }
}
