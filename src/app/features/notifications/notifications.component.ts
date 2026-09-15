import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';

interface AppNotification {
  id: string;
  category: 'Orders' | 'Promotions' | 'System';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="page-container section-padding">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Alerts &amp; Updates</span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Notification Center
          </h1>
          <p class="text-sm sm:text-base text-stone-500 mt-1">
            Track your delivery updates, festive oil offers, and mill announcements
          </p>
        </div>
        <button mat-button color="primary" (click)="markAllRead()" class="self-start sm:self-auto !font-bold !text-xs !rounded-full">
          Mark all as read
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        @for (filter of filters; track filter) {
          <mat-chip-option
            [selected]="activeFilter() === filter"
            (selectionChange)="activeFilter.set(filter)"
            color="primary"
          >
            {{ filter }}
          </mat-chip-option>
        }
      </div>

      <mat-divider class="!mb-6" />

      <div class="flex flex-col gap-4">
        @for (notif of filteredNotifications(); track notif.id) {
          <div
            class="bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all shadow-xs"
            [class.border-l-4]="!notif.isRead"
            [class.border-l-amber-700]="!notif.isRead"
            [class.bg-amber-50/20]="!notif.isRead"
            [class.border-stone-200/90]="notif.isRead"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              [class.bg-blue-50]="notif.category === 'Orders'"
              [class.text-blue-700]="notif.category === 'Orders'"
              [class.bg-amber-50]="notif.category === 'Promotions'"
              [class.text-amber-700]="notif.category === 'Promotions'"
              [class.bg-emerald-50]="notif.category === 'System'"
              [class.text-emerald-700]="notif.category === 'System'"
            >
              <mat-icon class="!w-6 !h-6 !text-2xl">{{ notif.icon }}</mat-icon>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start gap-2 mb-1">
                <h4 class="text-sm sm:text-base font-bold text-stone-900">{{ notif.title }}</h4>
                <span class="text-xs text-stone-400 whitespace-nowrap font-medium">{{ notif.time }}</span>
              </div>
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2.5">{{ notif.message }}</p>
              @if (notif.link) {
                <a [routerLink]="notif.link" class="text-xs sm:text-sm font-bold text-amber-800 hover:underline">
                  View Update →
                </a>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class NotificationsComponent {
  private readonly toastr = inject(ToastrService);

  readonly filters = ['All', 'Orders', 'Promotions', 'System'];
  readonly activeFilter = signal('All');

  readonly notifications = signal<AppNotification[]>([
    {
      id: 'notif-1',
      category: 'Orders',
      title: 'Freshly Pressed Batch Shipped — #NPO-2025-8841',
      message: 'Your 5L Wood Pressed Groundnut Oil has been dispatched via Blue Dart Express. Tracking No: BLD-849201948.',
      time: '1 hour ago',
      isRead: false,
      icon: 'local_shipping',
      link: '/orders/tracking/ord-9821'
    },
    {
      id: 'notif-2',
      category: 'Promotions',
      title: 'Festive Offer: 15% Off On Sesame & Lamp Oils',
      message: 'Use coupon PURE15 at checkout on all Gingelly (Sesame) and Pure Lamp Oils for authentic auspicious pujas.',
      time: '5 hours ago',
      isRead: false,
      icon: 'local_offer',
      link: '/products'
    },
    {
      id: 'notif-3',
      category: 'System',
      title: 'Nisha Pure Rewards: 1,480 Loyalty Points Credited',
      message: 'You have unlocked Gold Mill Patron status! Enjoy free priority dispatch on all cold-pressed oils.',
      time: 'Yesterday',
      isRead: true,
      icon: 'military_tech',
      link: '/profile'
    }
  ]);

  filteredNotifications(): AppNotification[] {
    const filter = this.activeFilter();
    if (filter === 'All') return this.notifications();
    return this.notifications().filter(n => n.category === filter);
  }

  markAllRead(): void {
    const updated = this.notifications().map(n => ({ ...n, isRead: true }));
    this.notifications.set(updated);
    this.toastr.info('All notifications marked as read.');
  }
}
