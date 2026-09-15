import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-payment',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex justify-center">
      <div class="max-w-md w-full bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 text-center shadow-xs">
        <div class="text-5xl sm:text-6xl mb-4 animate-pulse">⏳</div>
        <h1 class="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mb-2">
          Payment Processing
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400 mb-6">
          Your payment is securely being processed with our payment gateway. Please wait...
        </p>
        <div class="bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 p-4 mb-6 text-left flex flex-col gap-2">
          <div class="flex justify-between items-center text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            <span>Order Reference</span>
            <strong class="text-stone-900 dark:text-stone-100 font-semibold">#NPO-8841-2025</strong>
          </div>
          <div class="flex justify-between items-center text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            <span>Amount</span>
            <strong class="text-stone-900 dark:text-stone-100 font-semibold">₹1,840.00</strong>
          </div>
          <div class="flex justify-between items-center text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            <span>Method</span>
            <strong class="text-stone-900 dark:text-stone-100 font-semibold">UPI / NetBanking</strong>
          </div>
        </div>
        <a mat-flat-button routerLink="/orders" class="w-full !h-11 !rounded-xl !bg-amber-600 hover:!bg-amber-700 !text-white font-semibold shadow-sm">
          View My Orders
        </a>
      </div>
    </div>
  `,
  styles: [],
})
export class PaymentComponent {}

