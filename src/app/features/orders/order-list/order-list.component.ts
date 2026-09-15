import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatus } from '../../../core/enums/order-status.enum';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, SlicePipe, MatButtonModule, MatIconModule, MatChipsModule, EmptyStateComponent],
  template: `
    <div class="page-container section-padding">
      <div class="mb-8 sm:mb-10">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Purchase History</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">My Orders</h1>
        <p class="text-sm sm:text-base text-stone-500 mt-1">Track, return, or buy again from your previous cold-pressed oil orders</p>
      </div>

      @if (orders().length > 0) {
        <div class="flex flex-col gap-6">
          @for (order of orders(); track order.id) {
            <div class="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
              <!-- Order Header bar -->
              <div class="grid grid-cols-2 md:grid-cols-[1fr_1fr_1.5fr_1.5fr] gap-4 p-4 sm:px-6 sm:py-4 bg-stone-50 border-b border-stone-200 text-xs sm:text-sm">
                <div class="flex flex-col gap-1">
                  <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider">ORDER PLACED</span>
                  <span class="font-bold text-stone-800">{{ order.createdAt | slice:0:10 }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider">TOTAL AMOUNT</span>
                  <span class="font-extrabold text-amber-800">₹{{ order.total }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider">SHIP TO</span>
                  <span class="font-semibold text-stone-800 truncate">{{ order.shippingAddress.fullName }}</span>
                </div>
                <div class="flex flex-col md:items-end gap-1 md:ml-auto">
                  <span class="font-['Outfit',sans-serif] font-extrabold text-stone-900">#{{ order.orderNumber }}</span>
                  <a [routerLink]="['/orders', order.id]" class="text-xs font-bold text-amber-800 hover:underline">
                    View Details →
                  </a>
                </div>
              </div>

              <!-- Order Body -->
              <div class="p-5 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-stone-100">
                  <span
                    class="font-extrabold text-xs sm:text-sm flex items-center gap-1.5"
                    [class]="getStatusClass(order.status)"
                  >
                    <span class="w-2 h-2 rounded-full" [class]="getStatusDotClass(order.status)"></span>
                    {{ getStatusLabel(order.status) }}
                  </span>
                  @if (order.estimatedDelivery) {
                    <span class="text-xs text-stone-500">
                      Estimated Delivery: <strong class="text-stone-800 font-bold">{{ order.estimatedDelivery | slice:0:10 }}</strong>
                    </span>
                  }
                </div>

                <div class="flex flex-col gap-4 mb-6">
                  @for (item of order.items; track item.id) {
                    <div class="flex items-center gap-4">
                      <img [src]="item.productImage" [alt]="item.productName" class="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0" />
                      <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                        <h4 class="text-sm font-bold text-stone-900 m-0 truncate">{{ item.productName }}</h4>
                        <span class="text-xs text-stone-500 font-medium">
                          Qty: {{ item.quantity }} × ₹{{ item.unitPrice }}
                        </span>
                        <span class="text-[11px] text-stone-400">SKU: {{ item.sku }}</span>
                      </div>
                    </div>
                  }
                </div>

                <div class="flex gap-3 pt-4 border-t border-stone-100 flex-wrap">
                  <a mat-stroked-button [routerLink]="['/orders', order.id, 'tracking']" color="primary" class="!h-10 !rounded-full !font-bold">
                    <mat-icon class="mr-1 !text-base">local_shipping</mat-icon> Track Package
                  </a>
                  <a mat-button [routerLink]="['/orders', order.id]" class="!h-10 !rounded-full !font-bold text-stone-700">
                    <mat-icon class="mr-1 !text-base">receipt</mat-icon> Order Details
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <app-empty-state
          emoji="📦"
          title="No orders placed yet"
          description="Your order history will appear here once you make your first purchase."
          actionText="Discover Products"
          actionLink="/products"
        />
      }
    </div>
  `,
  styles: [],
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(res => {
      this.orders.set(res);
    });
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED: return 'Delivered';
      case OrderStatus.SHIPPED: return 'Shipped / In Transit';
      case OrderStatus.PROCESSING: return 'Processing Order';
      case OrderStatus.CONFIRMED: return 'Confirmed & Preparing';
      default: return status;
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED: return 'text-emerald-700';
      case OrderStatus.SHIPPED: return 'text-blue-600';
      case OrderStatus.PROCESSING:
      case OrderStatus.CONFIRMED: return 'text-amber-700';
      default: return 'text-stone-500';
    }
  }

  getStatusDotClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-emerald-600';
      case OrderStatus.SHIPPED: return 'bg-blue-600';
      case OrderStatus.PROCESSING:
      case OrderStatus.CONFIRMED: return 'bg-amber-600';
      default: return 'bg-stone-400';
    }
  }
}
