export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

export function normalizeOrderStatus(status: any): OrderStatus {
  if (!status) return OrderStatus.CONFIRMED;
  const s = String(status).trim().toUpperCase();
  if (s === 'PENDING') return OrderStatus.PENDING;
  if (s === 'CONFIRMED') return OrderStatus.CONFIRMED;
  if (s === 'PROCESSING') return OrderStatus.PROCESSING;
  if (s === 'PACKED') return OrderStatus.PACKED;
  if (s === 'SHIPPED') return OrderStatus.SHIPPED;
  if (s === 'OUT_FOR_DELIVERY' || s === 'OUT FOR DELIVERY') return OrderStatus.OUT_FOR_DELIVERY;
  if (s === 'DELIVERED') return OrderStatus.DELIVERED;
  if (s === 'CANCELLED' || s === 'CANCELED') return OrderStatus.CANCELLED;
  if (s === 'RETURN_REQUESTED') return OrderStatus.RETURN_REQUESTED;
  if (s === 'RETURNED') return OrderStatus.RETURNED;
  if (s === 'REFUNDED') return OrderStatus.REFUNDED;
  return OrderStatus.CONFIRMED;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [OrderStatus.PENDING]:           'Pending',
  [OrderStatus.CONFIRMED]:         'Confirmed',
  [OrderStatus.PROCESSING]:        'Processing',
  [OrderStatus.PACKED]:            'Packed',
  [OrderStatus.SHIPPED]:           'Shipped',
  [OrderStatus.OUT_FOR_DELIVERY]:  'Out for Delivery',
  [OrderStatus.DELIVERED]:         'Delivered',
  [OrderStatus.CANCELLED]:         'Cancelled',
  [OrderStatus.RETURN_REQUESTED]:  'Return Requested',
  [OrderStatus.RETURNED]:          'Returned',
  [OrderStatus.REFUNDED]:          'Refunded',
  'pending': 'Pending',
  'confirmed': 'Confirmed',
  'processing': 'Processing',
  'packed': 'Packed',
  'shipped': 'Shipped',
  'out_for_delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'return_requested': 'Return Requested',
  'returned': 'Returned',
  'refunded': 'Refunded',
};
