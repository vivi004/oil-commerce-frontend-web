import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatDividerModule, FormsModule, EmptyStateComponent],
  template: `
    <div class="page-container section-padding">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Your Basket</span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Shopping Cart</h1>
          <p class="text-sm sm:text-base text-stone-500 mt-1">
            You have <strong class="text-stone-800 font-bold">{{ cartService.itemCount() }}</strong> item{{ cartService.itemCount() === 1 ? '' : 's' }} in your cart
          </p>
        </div>
        @if (cartService.items().length > 0) {
          <button mat-button color="warn" (click)="cartService.clearCart()" class="self-start sm:self-auto !font-bold !text-xs !rounded-full">
            <mat-icon class="mr-1">delete_sweep</mat-icon> Clear All Items
          </button>
        }
      </div>

      @if (cartService.items().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          <!-- Items List Column -->
          <div class="flex flex-col gap-6">
            <div class="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
              <!-- Table Head (desktop) -->
              <div class="hidden sm:grid grid-cols-[3fr_1fr_1.2fr_1fr_48px] px-6 py-4 bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
                <span>Product</span>
                <span>Unit Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span></span>
              </div>

              <!-- Item Rows -->
              <div class="divide-y divide-stone-100">
                @for (item of cartService.items(); track item.id) {
                  <div class="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1.2fr_1fr_48px] gap-4 sm:gap-3 sm:items-center hover:bg-stone-50/50 transition-colors">
                    <!-- Product Info -->
                    <div class="flex gap-4 items-center">
                      <a [routerLink]="['/products', item.productId]" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200/80 bg-stone-50">
                        <img [src]="item.product.thumbnail" [alt]="item.product.name" class="w-full h-full object-cover" />
                      </a>
                      <div class="flex flex-col min-w-0">
                        <span class="text-[11px] font-extrabold uppercase text-amber-800 tracking-wider">{{ item.product.brand ?? 'Nisha Pure Oils' }}</span>
                        <h4 class="text-sm sm:text-[15px] font-bold text-stone-900 m-0 truncate leading-snug">
                          <a [routerLink]="['/products', item.productId]" class="text-stone-900 hover:text-amber-700 transition-colors no-underline">
                            {{ item.product.name }}
                          </a>
                        </h4>
                        @if (item.selectedVariantLabel) {
                          <span class="text-xs text-stone-500 mt-1">Size: <strong class="text-amber-900 font-bold">{{ item.selectedVariantLabel }}</strong></span>
                        }
                        <div class="sm:hidden text-xs text-stone-500 font-medium mt-1">
                          ₹{{ item.unitPrice }} / unit
                        </div>
                      </div>
                    </div>

                    <!-- Unit Price (desktop only) -->
                    <div class="hidden sm:block text-sm font-bold text-stone-800">
                      ₹{{ item.unitPrice }}
                    </div>

                    <!-- Quantity Stepper -->
                    <div class="flex items-center justify-between sm:justify-start gap-4">
                      <div class="flex items-center border border-stone-300 rounded-lg w-28 bg-white shadow-xs">
                        <button
                          class="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer text-base font-bold text-stone-500 hover:text-amber-800"
                          (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                          aria-label="Decrease"
                        >
                          -
                        </button>
                        <span class="flex-1 text-center text-xs sm:text-sm font-bold text-stone-900">{{ item.quantity }}</span>
                        <button
                          class="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer text-base font-bold text-stone-500 hover:text-amber-800"
                          (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>

                      <div class="sm:hidden font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                        ₹{{ item.totalPrice }}
                      </div>

                      <button
                        mat-icon-button
                        color="warn"
                        (click)="cartService.removeFromCart(item.id)"
                        class="sm:hidden !w-8 !h-8"
                        aria-label="Remove item"
                      >
                        <mat-icon class="!text-lg">delete_outline</mat-icon>
                      </button>
                    </div>

                    <!-- Subtotal (desktop only) -->
                    <div class="hidden sm:block font-['Outfit',sans-serif] text-base font-extrabold text-stone-900">
                      ₹{{ item.totalPrice }}
                    </div>

                    <!-- Delete button (desktop only) -->
                    <div class="hidden sm:block text-right">
                      <button
                        mat-icon-button
                        color="warn"
                        (click)="cartService.removeFromCart(item.id)"
                        aria-label="Remove item"
                      >
                        <mat-icon>delete_outline</mat-icon>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Free Shipping Progress -->
            <div class="p-5 bg-white border border-stone-200/90 rounded-2xl shadow-xs">
              <div class="flex items-center gap-3 mb-3 text-xs sm:text-sm">
                <mat-icon class="text-amber-700 !w-5 !h-5 !text-xl">local_shipping</mat-icon>
                <div>
                  @if (cartService.subtotal() >= 499) {
                    <strong class="text-emerald-700 font-bold">You unlocked FREE Express Delivery across Tamil Nadu! 🎉</strong>
                  } @else {
                    <span class="text-stone-700">
                      Add <strong class="text-amber-800 font-bold">₹{{ 499 - cartService.subtotal() }}</strong> more to unlock <strong class="text-emerald-700">FREE Delivery</strong>!
                    </span>
                  }
                </div>
              </div>
              <div class="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-emerald-600 to-green-500 rounded-full transition-all duration-300"
                  [style.width.%]="mathMin(100, (cartService.subtotal() / 499) * 100)"
                ></div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="p-6 bg-white border border-stone-200/90 rounded-2xl shadow-xs sticky top-28">
            <h3 class="font-['Outfit',sans-serif] text-xl font-extrabold text-stone-900 m-0">Order Summary</h3>
            <mat-divider class="!my-4" />

            <!-- Promo coupon input -->
            <div class="flex flex-col gap-2 mb-4">
              <label class="text-xs font-bold text-stone-600 uppercase tracking-wider">Promo / Coupon Code</label>
              <div class="flex gap-2">
                <input
                  type="text"
                  placeholder="Try: PURE20 or NISHA10"
                  class="flex-1 h-10 px-3.5 border border-stone-300 rounded-xl text-xs sm:text-sm outline-none focus:border-amber-700 font-medium"
                  [(ngModel)]="couponInput"
                  (keyup.enter)="onApplyCoupon()"
                />
                <button mat-raised-button color="primary" (click)="onApplyCoupon()" class="!h-10 !rounded-xl !font-bold">Apply</button>
              </div>
              @if (cartService.couponCode()) {
                <span class="text-xs text-emerald-700 font-bold">✓ Coupon Applied: {{ cartService.couponCode() }}</span>
              }
            </div>

            <mat-divider class="!my-4" />

            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center text-stone-600">
                <span>Subtotal</span>
                <span class="font-bold text-stone-900">₹{{ cartService.subtotal() }}</span>
              </div>

              @if (cartService.discountAmount() > 0) {
                <div class="flex justify-between items-center text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-₹{{ cartService.discountAmount() }}</span>
                </div>
              }

              <div class="flex justify-between items-center text-stone-600">
                <span>Delivery Charges</span>
                <span class="font-bold" [class.text-emerald-700]="cartService.shippingCost() === 0">
                  {{ cartService.shippingCost() === 0 ? 'FREE' : '₹' + cartService.shippingCost() }}
                </span>
              </div>

              <div class="flex justify-between items-center text-stone-600">
                <span>GST (5%)</span>
                <span class="font-bold text-stone-900">₹{{ cartService.taxAmount() }}</span>
              </div>
            </div>

            <mat-divider class="!my-4" />

            <div class="flex justify-between items-center my-4">
              <span class="text-base font-bold text-stone-900">Total Amount</span>
              <span class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-700">₹{{ cartService.total() }}</span>
            </div>

            <a
              mat-raised-button
              color="primary"
              routerLink="/checkout"
              class="w-full !h-12 !rounded-full !font-bold !text-base block text-center shadow-md shadow-amber-900/20"
            >
              Proceed to Checkout →
            </a>

            <div class="flex items-center justify-center gap-2 mt-4 text-xs text-stone-400 font-medium">
              <mat-icon class="!text-sm !w-4 !h-4">security</mat-icon>
              <span>100% Genuine Direct From Mill • Tamper Proof</span>
            </div>
          </div>
        </div>
      } @else {
        <app-empty-state
          emoji="🛢️"
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any cold-pressed oils or traditional snacks yet."
          actionText="Explore Pure Oils"
          actionLink="/products"
        />
      }
    </div>
  `,
  styles: [],
})
export class CartComponent {
  readonly cartService = inject(CartService);
  couponInput = '';

  onApplyCoupon(): void {
    if (this.couponInput) {
      this.cartService.applyCoupon(this.couponInput);
    }
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
