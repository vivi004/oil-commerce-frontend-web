import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-[80vh] flex items-center py-12 sm:py-16 bg-[var(--color-bg)]">
      <div class="page-container max-w-2xl mx-auto text-center w-full">
        <div class="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-12 shadow-md">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs">
            <mat-icon class="!text-4xl !w-10 !h-10">check_circle</mat-icon>
          </div>

          <span class="inline-block text-xs font-extrabold text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full mb-3 tracking-wider uppercase">
            ORDER PLACED SUCCESSFULLY
          </span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0 mb-3 leading-tight">
            Thank You For Choosing Pure Living!
          </h1>
          <p class="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-lg mx-auto mb-8">
            Your order has been recorded at our Kangeyam mill. Our packaging team is preparing your fresh cold-pressed oils.
          </p>

          <div class="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col gap-3 text-left">
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-stone-500 font-medium">Order Number:</span>
              <strong class="text-stone-900 font-extrabold font-mono">#NPO-{{ orderId }}</strong>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-stone-500 font-medium">Estimated Delivery:</span>
              <strong class="text-emerald-700 font-bold">Within 2–4 Business Days</strong>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-stone-500 font-medium">Fulfillment Mill:</span>
              <span class="text-stone-900 font-semibold">Nisha Pure Oils, Kangeyam Unit</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-stone-500 font-medium">Packaging Standard:</span>
              <span class="text-stone-900 font-semibold">Sealed Food-Grade Tamper-Evident</span>
            </div>
          </div>

          <!-- Progress timeline -->
          <div class="border-t border-stone-100 pt-6 mb-8">
            <h3 class="text-xs sm:text-sm font-bold text-stone-700 mb-5 text-left uppercase tracking-wider">Order Fulfillment Status</h3>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div class="flex flex-col items-center gap-1.5">
                <div class="w-8 h-8 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center shadow-xs">✓</div>
                <span class="text-[11px] sm:text-xs font-bold text-amber-900">Order Placed</span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <div class="w-8 h-8 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center shadow-xs">●</div>
                <span class="text-[11px] sm:text-xs font-bold text-amber-900">Mill Packing</span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <div class="w-8 h-8 rounded-full bg-stone-100 border-2 border-stone-300 text-stone-400 text-xs font-bold flex items-center justify-center">○</div>
                <span class="text-[11px] sm:text-xs font-semibold text-stone-400">Dispatched</span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <div class="w-8 h-8 rounded-full bg-stone-100 border-2 border-stone-300 text-stone-400 text-xs font-bold flex items-center justify-center">○</div>
                <span class="text-[11px] sm:text-xs font-semibold text-stone-400">Delivered</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 justify-center flex-wrap">
            <a mat-raised-button color="primary" routerLink="/products" class="!h-12 !px-7 !rounded-full !font-bold shadow-xs">
              <mat-icon class="mr-1.5 !text-base">storefront</mat-icon> Continue Shopping
            </a>
            <a mat-stroked-button routerLink="/orders" class="!h-12 !px-7 !rounded-full !font-bold">
              <mat-icon class="mr-1.5 !text-base">receipt_long</mat-icon> View My Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class OrderSuccessComponent {
  readonly orderId = Math.floor(100000 + Math.random() * 900000);
}
