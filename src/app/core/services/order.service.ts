import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, ShippingAddress } from '../models/order.model';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { CartItem } from '../models/cart.model';
import { ApiService } from './api.service';

const ORDERS_STORAGE_KEY = 'shopzone_orders_list';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9821',
    orderNumber: 'ORD-9821-2026',
    userId: 'user-1',
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.SUCCESS,
    paymentMethod: 'UPI (Google Pay)',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productName: 'Wood Pressed Groundnut Oil (Marachekku Kadalai Ennai)',
        productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80',
        sku: 'NPO-GNO-5L',
        productSku: 'NPO-GNO-5L',
        quantity: 1,
        unitPrice: 1650.00,
        totalPrice: 1650.00
      }
    ],
    shippingAddress: {
      fullName: 'Kavitha Sundaram',
      phone: '+91 98421 88442',
      addressLine1: '42, Cross Cut Road, Gandhipuram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postalCode: '641012',
      country: 'India',
      isDefault: true
    },
    subtotal: 1650.00,
    shippingCost: 0,
    taxAmount: 82.50,
    discountAmount: 0,
    totalAmount: 1732.50,
    total: 1732.50,
    trackingNumber: 'TRK-ST-99482104',
    carrier: 'ST Courier Priority',
    estimatedDelivery: '2026-03-20T18:00:00Z',
    statusHistory: [
      { status: OrderStatus.PENDING, timestamp: '2026-03-15T10:15:00Z', note: 'Order placed successfully' },
      { status: OrderStatus.CONFIRMED, timestamp: '2026-03-15T10:30:00Z', note: 'UPI Payment verified' },
      { status: OrderStatus.PROCESSING, timestamp: '2026-03-16T08:00:00Z', note: 'Pressed fresh from Vaagai Mara Chekku' },
      { status: OrderStatus.SHIPPED, timestamp: '2026-03-16T14:20:00Z', note: 'Handed over to ST Courier Coimbatore Hub' }
    ],
    createdAt: '2026-03-15T10:15:00Z',
    updatedAt: '2026-03-16T14:20:00Z'
  },
  {
    id: 'ord-8419',
    orderNumber: 'ORD-8419-2026',
    userId: 'user-1',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.SUCCESS,
    paymentMethod: 'Credit Card (ending in 4242)',
    items: [
      {
        id: 'oi-2',
        productId: 'prod-2',
        productName: 'Cold Pressed Virgin Coconut Oil (Thengai Ennai)',
        productImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=700&auto=format&fit=crop&q=80',
        sku: 'NPO-VCO-1L',
        productSku: 'NPO-VCO-1L',
        quantity: 2,
        unitPrice: 470.00,
        totalPrice: 940.00
      },
      {
        id: 'oi-3',
        productId: 'prod-3',
        productName: 'Wood Pressed Sesame Oil (Gingelly / Nalla Ennai)',
        productImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&auto=format&fit=crop&q=80',
        sku: 'NPO-SES-1L',
        productSku: 'NPO-SES-1L',
        quantity: 1,
        unitPrice: 490.00,
        totalPrice: 490.00
      }
    ],
    shippingAddress: {
      fullName: 'Kavitha Sundaram',
      phone: '+91 98421 88442',
      addressLine1: '42, Cross Cut Road, Gandhipuram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postalCode: '641012',
      country: 'India',
      isDefault: true
    },
    subtotal: 1430.00,
    shippingCost: 0,
    taxAmount: 71.50,
    discountAmount: 143.00,
    couponCode: 'WELCOME10',
    totalAmount: 1358.50,
    total: 1358.50,
    trackingNumber: 'TRK-EXP-88349210',
    carrier: 'India Post Speed Post',
    deliveredAt: '2026-03-12T16:45:00Z',
    statusHistory: [
      { status: OrderStatus.PENDING, timestamp: '2026-03-10T11:00:00Z', note: 'Order placed' },
      { status: OrderStatus.CONFIRMED, timestamp: '2026-03-10T11:15:00Z', note: 'Payment approved' },
      { status: OrderStatus.PROCESSING, timestamp: '2026-03-11T09:00:00Z', note: 'Packed at Erode distribution mill' },
      { status: OrderStatus.SHIPPED, timestamp: '2026-03-11T17:00:00Z', note: 'Shipped from hub' },
      { status: OrderStatus.DELIVERED, timestamp: '2026-03-12T16:45:00Z', note: 'Package handed to resident' }
    ],
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-12T16:45:00Z'
  }
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly _orders = signal<Order[]>(this.loadOrders());
  readonly orders = this._orders.asReadonly();

  getOrders(): Observable<Order[]> {
    return of(this._orders());
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
    let orders = INITIAL_ORDERS;
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          orders = parsed;
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
