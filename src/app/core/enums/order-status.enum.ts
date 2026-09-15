export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURN_REQUESTED = 'return_requested',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
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
};
