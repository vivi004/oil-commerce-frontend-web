import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink, SlicePipe, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, EmptyStateComponent],
  template: `
    <div class="page-container section-padding">
      @if (order(); as ord) {
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div class="flex items-center gap-3 sm:gap-4">
            <a mat-icon-button routerLink="/orders" aria-label="Back to orders" class="shrink-0 !border !border-stone-200">
              <mat-icon>arrow_back</mat-icon>
            </a>
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Invoice Details</span>
              <h1 class="font-['Outfit',sans-serif] text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 m-0">Order #{{ ord.orderNumber }}</h1>
              <p class="text-xs sm:text-sm text-stone-500 mt-1">Placed on {{ ord.createdAt | slice:0:10 }} • Paid via {{ ord.paymentMethod }}</p>
            </div>
          </div>
          <a mat-raised-button color="primary" [routerLink]="['/orders', ord.id, 'tracking']" class="!h-11 !px-6 !rounded-full !font-bold self-start sm:self-auto shadow-xs">
            <mat-icon class="mr-1.5 !text-base">local_shipping</mat-icon> Track Package
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          <!-- Items List & Delivery Card -->
          <div class="flex flex-col gap-6">
            <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 m-0">Items Ordered ({{ ord.items.length }})</h3>
              <mat-divider class="!my-4" />

              <div class="divide-y divide-stone-100">
                @for (item of ord.items; track item.id) {
                  <div class="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img [src]="item.productImage" [alt]="item.productName" class="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0" />
                    <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                      <h4 class="text-sm sm:text-[15px] font-bold text-stone-900 m-0 truncate">{{ item.productName }}</h4>
                      <span class="text-xs text-stone-400">SKU: {{ item.sku }}</span>
                      <span class="text-xs text-stone-600 font-medium">Quantity: {{ item.quantity }}</span>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="block text-xs text-stone-400">₹{{ item.unitPrice }} each</span>
                      <span class="font-['Outfit',sans-serif] text-base font-extrabold text-amber-800">₹{{ item.totalPrice }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Delivery Address Card -->
            <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 m-0">Shipping &amp; Delivery Details</h3>
              <mat-divider class="!my-4" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Recipient:</span>
                  <strong class="text-stone-900 font-bold block mb-1 text-sm">{{ ord.shippingAddress.fullName }}</strong>
                  <p class="text-stone-600 leading-relaxed m-0 mb-2">
                    {{ ord.shippingAddress.addressLine1 }}<br />
                    {{ ord.shippingAddress.city }}, {{ ord.shippingAddress.state }} {{ ord.shippingAddress.postalCode }}<br />
                    {{ ord.shippingAddress.country }}
                  </p>
                  <span class="text-xs text-stone-500 font-medium">Contact: <strong class="text-stone-800">{{ ord.shippingAddress.phone }}</strong></span>
                </div>

                <div>
                  <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Shipping Carrier:</span>
                  <strong class="text-stone-900 font-bold block mb-1 text-sm">{{ ord.carrier ?? 'FastExpress Priority' }}</strong>
                  <p class="text-stone-600 m-0 mb-2">
                    Tracking Number: <strong class="text-amber-900 font-mono">{{ ord.trackingNumber ?? 'Pending Assignment' }}</strong>
                  </p>
                  @if (ord.estimatedDelivery) {
                    <span class="text-xs text-stone-500">Est. Delivery: <strong class="text-stone-800">{{ ord.estimatedDelivery | slice:0:10 }}</strong></span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Summary Sidebar -->
          <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs sticky top-28">
            <h3 class="font-['Outfit',sans-serif] text-xl font-extrabold text-stone-900 m-0">Payment Summary</h3>
            <mat-divider class="!my-4" />

            <div class="space-y-3 text-sm text-stone-600">
              <div class="flex justify-between">
                <span>Items Subtotal</span>
                <span class="font-bold text-stone-900">₹{{ ord.subtotal }}</span>
              </div>

              @if (ord.discountAmount > 0) {
                <div class="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({{ ord.couponCode }})</span>
                  <span>-₹{{ ord.discountAmount }}</span>
                </div>
              }

              <div class="flex justify-between">
                <span>Shipping &amp; Delivery</span>
                <span class="font-bold" [class.text-emerald-700]="ord.shippingCost === 0">
                  {{ ord.shippingCost === 0 ? 'FREE' : '₹' + ord.shippingCost }}
                </span>
              </div>

              <div class="flex justify-between">
                <span>GST (5%)</span>
                <span class="font-bold text-stone-900">₹{{ ord.taxAmount }}</span>
              </div>
            </div>

            <mat-divider class="!my-4" />

            <div class="flex justify-between items-center my-4">
              <span class="font-bold text-stone-900 text-base">Total Paid</span>
              <span class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-700">₹{{ ord.total }}</span>
            </div>

            <div class="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold mt-4">
              <mat-icon class="!text-base !w-4 !h-4 text-emerald-600">check_circle</mat-icon>
              <span>Paid via {{ ord.paymentMethod }}</span>
            </div>
          </div>
        </div>
      } @else {
        <app-empty-state
          icon="error_outline"
          title="Order not found"
          description="We couldn't find an order matching that identifier."
          actionText="View All Orders"
          actionLink="/orders"
        />
      }
    </div>
  `,
  styles: [],
})
export class OrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderService.getOrderById(id).subscribe(ord => {
          this.order.set(ord ?? null);
        });
      }
    });
  }
}
