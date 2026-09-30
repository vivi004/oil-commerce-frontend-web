import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatus, normalizeOrderStatus } from '../../../core/enums/order-status.enum';

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
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block">Live Shipment Tracking</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Instant Live Sync
            </span>
          </div>
          <h1 class="font-['Outfit',sans-serif] text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 m-0">Order #{{ order()?.orderNumber ?? orderId() }}</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Carrier: <strong class="text-stone-800">{{ order()?.carrier ?? 'DTDC Express' }}</strong> • Tracking ID: <strong class="text-amber-900 font-mono">{{ order()?.trackingNumber ?? 'Pending' }}</strong>
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
        <!-- Status Box & Timeline -->
        <div class="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-4 sm:gap-5 pb-6 mb-8 border-b border-stone-100">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all"
              [class.bg-emerald-50]="isDelivered()"
              [class.text-emerald-700]="isDelivered()"
              [class.border-emerald-200]="isDelivered()"
              [class.bg-amber-50]="!isDelivered()"
              [class.text-amber-800]="!isDelivered()"
              [class.border-amber-200/60]="!isDelivered()"
            >
              <mat-icon class="!text-3xl !w-8 !h-8">{{ isDelivered() ? 'verified' : 'local_shipping' }}</mat-icon>
            </div>
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-stone-400">Current Status</span>
              <h2 class="font-['Outfit',sans-serif] text-lg sm:text-2xl font-extrabold text-stone-900 m-0 my-1">{{ getCurrentStatusText() }}</h2>
              <p class="text-xs sm:text-sm text-stone-500 m-0">
                @if (isDelivered()) {
                  <span class="text-emerald-700 font-bold">Package Successfully Delivered</span>
                } @else {
                  Estimated Delivery: <strong class="text-stone-800 font-bold">{{ (order()?.estimatedDelivery | slice:0:10) ?? 'In 2-3 Business Days' }}</strong>
                }
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
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly spinner = inject(NgxSpinnerService);

  readonly orderId = signal<string>('');
  readonly order = signal<Order | null>(null);
  readonly steps = signal<StepDisplay[]>([]);

  private pollSub?: Subscription;
  private channel?: BroadcastChannel;
  private storageListener?: (e: StorageEvent) => void;

  ngOnInit(): void {
    // Dismiss any active spinner so tracking view is never blocked
    this.spinner.hide();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? 'ord-9821';
      this.orderId.set(id);

      // 1. Initial cached order
      this.orderService.getOrderById(id).subscribe(ord => {
        if (ord) this.applyOrder(ord);
      });

      // 2. Immediate live fetch from backend (silently in background)
      this.orderService.fetchLiveOrder(id, true).subscribe(ord => {
        if (ord) this.applyOrder(ord);
      });

      // 3. Fast real-time live polling silently every 4 seconds in background
      this.pollSub?.unsubscribe();
      this.pollSub = interval(4000).pipe(
        switchMap(() => this.orderService.fetchLiveOrder(id, true))
      ).subscribe(ord => {
        if (ord) this.applyOrder(ord);
      });
    });

    // 4. Instant 0ms broadcast channel listener (when updated from admin in another tab)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('nisha_orders_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'ORDER_STATUS_UPDATED') {
            const currentId = this.orderId();
            const { orderId, orderNumber } = event.data;
            if (
              orderId === currentId ||
              orderNumber === currentId ||
              this.order()?.id === orderId ||
              this.order()?.orderNumber === orderNumber
            ) {
              this.orderService.fetchLiveOrder(currentId, true).subscribe(ord => {
                if (ord) this.applyOrder(ord);
              });
            }
          }
        };
      }
    } catch {}

    // 5. Storage event listener for cross-tab updates
    if (typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === 'nisha_last_order_update' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            const currentId = this.orderId();
            if (
              parsed.orderId === currentId ||
              parsed.orderNumber === currentId ||
              this.order()?.id === parsed.orderId ||
              this.order()?.orderNumber === parsed.orderNumber
            ) {
              this.orderService.fetchLiveOrder(currentId, true).subscribe(ord => {
                if (ord) this.applyOrder(ord);
              });
            }
          } catch {}
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  applyOrder(orderData: Order): void {
    this.order.set(orderData);
    this.buildSteps(orderData);
  }

  isDelivered(): boolean {
    return normalizeOrderStatus(this.order()?.status) === OrderStatus.DELIVERED;
  }

  getCurrentStatusText(): string {
    const status = normalizeOrderStatus(this.order()?.status);
    if (status === OrderStatus.DELIVERED) return 'Delivered to Destination';
    if (status === OrderStatus.OUT_FOR_DELIVERY) return 'Out for Delivery with Courier';
    if (status === OrderStatus.SHIPPED) return 'In Transit with Express Carrier';
    if (status === OrderStatus.PACKED) return 'Bottles Sealed & Boxed at Facility';
    if (status === OrderStatus.PROCESSING) return 'Cold-Press Packaging & Preparation';
    return 'Order Confirmed & Prepared';
  }

  private buildSteps(order: Order | null): void {
    const status = normalizeOrderStatus(order?.status);
    const isDelivered = status === OrderStatus.DELIVERED;
    const isOutForDelivery = status === OrderStatus.OUT_FOR_DELIVERY || isDelivered;
    const isShipped = status === OrderStatus.SHIPPED || isOutForDelivery;
    const isPacked = status === OrderStatus.PACKED || isShipped;
    const isProcessing = status === OrderStatus.PROCESSING || isPacked;

    const updatedTime = order?.updatedAt ? order.updatedAt.slice(0, 16).replace('T', ' ') : undefined;
    const createdTime = order?.createdAt ? order.createdAt.slice(0, 16).replace('T', ' ') : 'Just now';

    this.steps.set([
      {
        label: 'Order Confirmed',
        desc: 'We received your order and payment verified',
        done: true,
        active: !isProcessing && !isPacked && !isShipped && !isDelivered,
        time: createdTime
      },
      {
        label: 'Packed & Processed',
        desc: 'Bottles sealed and boxed in protective corrugated packaging',
        done: isProcessing,
        active: isProcessing && !isShipped,
        time: isProcessing ? updatedTime : undefined
      },
      {
        label: 'In Transit / Shipped',
        desc: `Handed over to ${order?.carrier || 'DTDC Express'}`,
        done: isShipped,
        active: isShipped && !isOutForDelivery,
        time: isShipped ? updatedTime : undefined
      },
      {
        label: 'Out for Delivery',
        desc: 'Courier vehicle assigned for destination drop-off',
        done: isOutForDelivery,
        active: isOutForDelivery && !isDelivered,
        time: isOutForDelivery ? updatedTime : undefined
      },
      {
        label: 'Delivered',
        desc: 'Delivered to recipient address',
        done: isDelivered,
        active: isDelivered,
        time: isDelivered ? updatedTime : undefined
      }
    ]);
  }
}
