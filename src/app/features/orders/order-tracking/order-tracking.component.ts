import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatus } from '../../../core/enums/order-status.enum';

interface StepDisplay {
  label: string;
  desc: string;
  done: boolean;
  active: boolean;
  time?: string;
}

@Component({
  selector: 'app-order-tracking',
  imports: [RouterLink, SlicePipe, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container section-padding">
      <div class="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <a mat-icon-button [routerLink]="['/orders', order()?.id ?? '']" aria-label="Back to order" class="shrink-0 !border !border-stone-200">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Live Shipment Tracking</span>
          <h1 class="font-['Outfit',sans-serif] text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 m-0">Order #{{ order()?.orderNumber ?? orderId() }}</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Carrier: <strong class="text-stone-800">{{ order()?.carrier ?? 'FastExpress Priority' }}</strong> • Tracking ID: <strong class="text-amber-900 font-mono">{{ order()?.trackingNumber ?? 'Pending' }}</strong>
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
        <!-- Status Box & Timeline -->
        <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-4 sm:gap-5 pb-6 mb-8 border-b border-stone-100">
            <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0">
              <mat-icon class="!text-3xl !w-8 !h-8">local_shipping</mat-icon>
            </div>
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-stone-400">Current Status</span>
              <h2 class="font-['Outfit',sans-serif] text-lg sm:text-2xl font-extrabold text-stone-900 m-0 my-1">{{ getCurrentStatusText() }}</h2>
              <p class="text-xs sm:text-sm text-stone-500 m-0">
                Estimated Delivery: <strong class="text-stone-800 font-bold">{{ (order()?.estimatedDelivery | slice:0:10) ?? 'In 2-3 Business Days' }}</strong>
              </p>
            </div>
          </div>

          <!-- Vertical Step Timeline -->
          <div class="flex flex-col">
            @for (step of steps(); track step.label; let last = $last) {
              <div class="flex items-start gap-5 relative">
                <div
                  class="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors shadow-xs"
                  [class.bg-emerald-600]="step.done"
                  [class.border-emerald-600]="step.done"
                  [class.text-white]="step.done"
                  [class.bg-amber-700]="step.active && !step.done"
                  [class.border-amber-700]="step.active && !step.done"
                  [class.text-white]="step.active && !step.done"
                  [class.bg-stone-50]="!step.done && !step.active"
                  [class.border-stone-300]="!step.done && !step.active"
                  [class.text-stone-400]="!step.done && !step.active"
                >
                  @if (step.done) {
                    <mat-icon class="!text-lg !w-5 !h-5">check</mat-icon>
                  } @else if (step.active) {
                    <mat-icon class="!text-lg !w-5 !h-5">radio_button_checked</mat-icon>
                  } @else {
                    <mat-icon class="!text-lg !w-5 !h-5">radio_button_unchecked</mat-icon>
                  }
                </div>
                @if (!last) {
                  <div
                    class="absolute left-[19px] top-10 -bottom-2 w-0.5 z-0"
                    [class.bg-emerald-500]="step.done"
                    [class.bg-stone-200]="!step.done"
                  ></div>
                }
                <div class="pb-8 flex-1 min-w-0">
                  <div class="flex justify-between items-center gap-2">
                    <span class="text-sm sm:text-base font-bold text-stone-900">{{ step.label }}</span>
                    @if (step.time) {
                      <span class="text-xs text-stone-400 font-medium shrink-0">{{ step.time }}</span>
                    }
                  </div>
                  <p class="text-xs sm:text-sm text-stone-500 m-0 mt-1 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Destination Address Card -->
        <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs sticky top-28">
          <h3 class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 m-0 mb-4">Delivery Destination</h3>
          @if (order()?.shippingAddress; as addr) {
            <div class="flex gap-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <mat-icon class="text-amber-700 shrink-0 !text-xl !w-5 !h-5 mt-0.5">location_on</mat-icon>
              <div>
                <strong class="text-stone-900 block font-bold mb-1 text-sm">{{ addr.fullName }}</strong>
                <p class="m-0 text-stone-600">{{ addr.addressLine1 }}</p>
                <p class="m-0 text-stone-600">{{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}</p>
                <p class="m-0 text-stone-600">{{ addr.country }}</p>
                <span class="block text-xs text-stone-500 mt-2 font-medium">Phone: <strong class="text-stone-800">{{ addr.phone }}</strong></span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class OrderTrackingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly orderId = signal<string>('');
  readonly order = signal<Order | null>(null);
  readonly steps = signal<StepDisplay[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? 'ord-9821';
      this.orderId.set(id);
      this.orderService.getOrderById(id).subscribe(ord => {
        const orderData = ord ?? null;
        this.order.set(orderData);
        this.buildSteps(orderData);
      });
    });
  }

  getCurrentStatusText(): string {
    const status = this.order()?.status;
    if (status === OrderStatus.DELIVERED) return 'Delivered to Destination';
    if (status === OrderStatus.SHIPPED) return 'In Transit with Express Carrier';
    if (status === OrderStatus.PROCESSING) return 'Departing Kangeyam Facility';
    return 'Order Confirmed & Prepared';
  }

  private buildSteps(order: Order | null): void {
    const status = order?.status ?? OrderStatus.CONFIRMED;
    const isDelivered = status === OrderStatus.DELIVERED;
    const isShipped = status === OrderStatus.SHIPPED || isDelivered;
    const isProcessing = status === OrderStatus.PROCESSING || isShipped;

    this.steps.set([
      {
        label: 'Order Confirmed',
        desc: 'We received your order and payment verified',
        done: true,
        active: !isProcessing,
        time: order?.createdAt ? order.createdAt.slice(0, 16).replace('T', ' ') : 'Feb 8, 10:30 AM'
      },
      {
        label: 'Packed & Processed',
        desc: 'Bottles sealed and boxed in protective corrugated packaging',
        done: isProcessing,
        active: isProcessing && !isShipped,
        time: isProcessing ? 'Feb 9, 08:00 AM' : undefined
      },
      {
        label: 'In Transit / Shipped',
        desc: `Handed over to ${order?.carrier ?? 'FastExpress Priority'}`,
        done: isShipped,
        active: isShipped && !isDelivered,
        time: isShipped ? 'Feb 9, 02:20 PM' : undefined
      },
      {
        label: 'Out for Delivery',
        desc: 'Courier vehicle assigned for destination drop-off',
        done: isDelivered,
        active: false,
        time: isDelivered ? 'Feb 10, 09:15 AM' : undefined
      },
      {
        label: 'Delivered',
        desc: 'Delivered to recipient address',
        done: isDelivered,
        active: isDelivered,
        time: isDelivered ? 'Feb 10, 04:45 PM' : undefined
      }
    ]);
  }
}
