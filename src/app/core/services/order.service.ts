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
    orderNumber: 'ORD-9821-2025',
    userId: 'user-1',
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.SUCCESS,
    paymentMethod: 'Credit Card (ending in 4242)',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
        sku: 'SNY-WH-XM5-BLK',
        productSku: 'SNY-WH-XM5-BLK',
        quantity: 1,
        unitPrice: 349.99,
        totalPrice: 349.99
      }
    ],
    shippingAddress: {
      fullName: 'Alex Morgan',
      phone: '+1 (555) 234-5678',
      addressLine1: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      isDefault: true
    },
    subtotal: 349.99,
    shippingCost: 0,
    taxAmount: 28.00,
    discountAmount: 0,
    totalAmount: 377.99,
    total: 377.99,
    trackingNumber: 'TRK-USPS-849201948',
    carrier: 'USPS Priority Express',
    estimatedDelivery: '2025-02-15T18:00:00Z',
    statusHistory: [
      { status: OrderStatus.PENDING, timestamp: '2025-02-08T10:15:00Z', note: 'Order placed successfully' },
      { status: OrderStatus.CONFIRMED, timestamp: '2025-02-08T10:30:00Z', note: 'Payment verified' },
      { status: OrderStatus.PROCESSING, timestamp: '2025-02-09T08:00:00Z', note: 'Packed at distribution hub' },
      { status: OrderStatus.SHIPPED, timestamp: '2025-02-09T14:20:00Z', note: 'In transit with USPS' }
    ],
    createdAt: '2025-02-08T10:15:00Z',
    updatedAt: '2025-02-09T14:20:00Z'
  },
  {
    id: 'ord-8419',
    orderNumber: 'ORD-8419-2025',
    userId: 'user-1',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.SUCCESS,
    paymentMethod: 'Apple Pay',
    items: [
      {
        id: 'oi-2',
        productId: 'prod-4',
        productName: 'Nike Air Zoom Pegasus 40 Running Shoes',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
        sku: 'NKE-PEG-40-WHT',
        productSku: 'NKE-PEG-40-WHT',
        quantity: 1,
        unitPrice: 130.00,
        totalPrice: 130.00
      },
      {
        id: 'oi-3',
        productId: 'prod-7',
        productName: 'Organic Vitamin C Glow Serum',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&auto=format&fit=crop&q=80',
        sku: 'GLW-SRM-30ML',
        productSku: 'GLW-SRM-30ML',
        quantity: 2,
        unitPrice: 38.00,
        totalPrice: 76.00
      }
    ],
    shippingAddress: {
      fullName: 'Alex Morgan',
      phone: '+1 (555) 234-5678',
      addressLine1: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      isDefault: true
    },
    subtotal: 206.00,
    shippingCost: 0,
    taxAmount: 16.48,
    discountAmount: 20.00,
    couponCode: 'SAVE20',
    totalAmount: 202.48,
    total: 202.48,
    trackingNumber: 'TRK-FDX-99382104',
    carrier: 'FedEx Ground',
    deliveredAt: '2025-01-28T16:45:00Z',
    statusHistory: [
      { status: OrderStatus.PENDING, timestamp: '2025-01-25T11:00:00Z', note: 'Order placed' },
      { status: OrderStatus.CONFIRMED, timestamp: '2025-01-25T11:15:00Z', note: 'Payment approved' },
      { status: OrderStatus.PROCESSING, timestamp: '2025-01-26T09:00:00Z', note: 'Processing & packing' },
      { status: OrderStatus.SHIPPED, timestamp: '2025-01-26T17:00:00Z', note: 'Shipped from hub' },
      { status: OrderStatus.DELIVERED, timestamp: '2025-01-28T16:45:00Z', note: 'Package handed to resident' }
    ],
    createdAt: '2025-01-25T11:00:00Z',
    updatedAt: '2025-01-28T16:45:00Z'
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
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (_err) {
      // Ignore JSON parse errors and return fallback
    }
    return INITIAL_ORDERS;
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (_err) {
      // Ignore storage write errors
    }
  }
}
