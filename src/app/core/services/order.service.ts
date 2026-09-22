import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, ShippingAddress } from '../models/order.model';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { CartItem } from '../models/cart.model';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';

const ORDERS_STORAGE_KEY = 'shopzone_orders_list';

export const INITIAL_ORDERS: Order[] = [];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly _orders = signal<Order[]>(this.loadOrders());
  readonly orders = this._orders.asReadonly();
  readonly isSyncing = signal<boolean>(false);

  getOrders(): Observable<Order[]> {
    return of(this._orders());
  }

  syncLiveOrders(): Observable<Order[]> {
    this.isSyncing.set(true);
    return this.api.get<any>(API_ENDPOINTS.ORDERS.LIST).pipe(
      map(res => {
        const items = res?.data?.items || res?.data;
        if (Array.isArray(items) && items.length > 0) {
          const mappedFromBackend: Order[] = items.map((dto: any) => ({
            id: dto.id,
            orderNumber: dto.orderNumber,
            userId: dto.userId || 'customer',
            status: (dto.status || OrderStatus.CONFIRMED) as OrderStatus,
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
            shippingAddress: typeof dto.shippingAddress === 'object' && dto.shippingAddress !== null ? dto.shippingAddress : {
              fullName: dto.customerName || 'Store Customer',
              phone: dto.customerPhone || '+91 98421 00000',
              addressLine1: typeof dto.shippingAddress === 'string' ? dto.shippingAddress : 'Coimbatore, Tamil Nadu',
              city: 'Coimbatore',
              state: 'Tamil Nadu',
              postalCode: '641012',
              country: 'India',
              isDefault: true
            },
            subtotal: Number(dto.subtotal || dto.totalAmount || 0),
            shippingCost: Number(dto.shippingCost || 0),
            taxAmount: Number(dto.taxAmount || 0),
            discountAmount: Number(dto.discountAmount || 0),
            totalAmount: Number(dto.grandTotal || dto.totalAmount || dto.total || 0),
            total: Number(dto.grandTotal || dto.totalAmount || dto.total || 0),
            trackingNumber: dto.trackingNumber,
            carrier: dto.carrier,
            createdAt: dto.createdAt ? new Date(typeof dto.createdAt === 'number' ? dto.createdAt * 1000 : dto.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dto.updatedAt ? new Date(typeof dto.updatedAt === 'number' ? dto.updatedAt * 1000 : dto.updatedAt).toISOString() : new Date().toISOString()
          }));

          const localOrders = this.loadOrders();
          const backendIds = new Set(mappedFromBackend.map(o => o.id));
          const merged = [...mappedFromBackend, ...localOrders.filter(o => !backendIds.has(o.id))];
          this._orders.set(merged);
          this.saveOrders(merged);
          this.isSyncing.set(false);
          return merged;
        }
        const refreshed = this.loadOrders();
        this._orders.set(refreshed);
        this.isSyncing.set(false);
        return refreshed;
      }),
      catchError(() => {
        const refreshed = this.loadOrders();
        this._orders.set(refreshed);
        this.isSyncing.set(false);
        return of(refreshed);
      })
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this._orders().find(o => o.id === id || o.orderNumber === id);
    return of(order);
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
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    const localOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: 'customer',
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
          createdAt: dto?.createdAt ? new Date(typeof dto.createdAt === 'number' ? dto.createdAt * 1000 : dto.createdAt).toISOString() : localOrder.createdAt,
          updatedAt: dto?.updatedAt ? new Date(typeof dto.updatedAt === 'number' ? dto.updatedAt * 1000 : dto.updatedAt).toISOString() : localOrder.updatedAt
        };
        const updated = [mappedOrder, ...this._orders()];
        this._orders.set(updated);
        this.saveOrders(updated);
        return mappedOrder;
      }),
      catchError(() => {
        const updated = [localOrder, ...this._orders()];
        this._orders.set(updated);
        this.saveOrders(updated);
        return of(localOrder);
      })
    );
  }

  private loadOrders(): Order[] {
    let orders: Order[] = [];
    const demoIds = new Set(['ord-9821', 'ord-8419', 'ord-7612', 'ord-8841', 'ord-8842', 'ord-8843']);
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          orders = parsed.filter(o => !demoIds.has(o.id) && !o.orderNumber?.startsWith?.('NPO-2025-') && !o.orderNumber?.startsWith?.('DEMO-'));
          this.saveOrders(orders);
        }
      }

      // Sync status/tracking from admin panel if present in browser storage
      const adminOrdersRaw = localStorage.getItem('nisha_admin_orders_v1');
      if (adminOrdersRaw) {
        const adminOrders = JSON.parse(adminOrdersRaw);
        if (Array.isArray(adminOrders)) {
          const adminMap = new Map<string, any>();
          for (const ao of adminOrders) {
            if (ao.id) adminMap.set(ao.id, ao);
            if (ao.orderNumber) adminMap.set(ao.orderNumber, ao);
          }

          orders = orders.map(ord => {
            const adminMatch = adminMap.get(ord.id) || adminMap.get(ord.orderNumber);
            if (adminMatch) {
              return {
                ...ord,
                status: adminMatch.status || ord.status,
                trackingNumber: adminMatch.trackingNumber || ord.trackingNumber,
                carrier: adminMatch.carrier || ord.carrier,
                updatedAt: adminMatch.updatedAt || ord.updatedAt
              };
            }
            return ord;
          });
        }
      }
    } catch (_err) {
      // Ignore JSON parse errors and return fallback
    }
    return orders;
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (_err) {
      // Ignore storage write errors
    }
  }
}
