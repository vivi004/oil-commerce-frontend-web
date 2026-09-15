import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  requiresAuth?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink, RouterLinkActive, MatIconModule, MatListModule,
    MatDividerModule, MatButtonModule, MatBadgeModule,
  ],
  template: `
    <nav
      class="fixed top-0 left-0 bottom-0 w-[min(300px,85vw)] bg-white border-r border-stone-200 flex flex-col -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[200] shadow-2xl"
      [class.!translate-x-0]="isOpen()"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 h-20 shrink-0 border-b border-stone-100">
        <a routerLink="/home" class="flex items-center gap-2.5 no-underline text-xl" (click)="closeEvent.emit()">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xs">
            <span class="text-xl">🪔</span>
          </div>
          <span class="font-['Outfit',sans-serif] text-lg font-extrabold text-stone-900">Nisha Pure Oils</span>
        </a>
        <button class="bg-transparent border-0 cursor-pointer text-stone-600 flex items-center justify-center p-2 rounded-full hover:bg-stone-100 transition-colors" (click)="closeEvent.emit()" aria-label="Close sidebar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Navigation Sections -->
      <div class="flex-1 overflow-y-auto py-3">
        @for (section of navSections; track section.title) {
          <div class="mb-2">
            <span class="block px-6 pt-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">{{ section.title }}</span>
            <mat-nav-list>
              @for (item of section.items; track item.route) {
                <a
                  mat-list-item
                  [routerLink]="item.route"
                  routerLinkActive="!bg-amber-100/80 !text-amber-950 !font-bold"
                  [routerLinkActiveOptions]="{ exact: item.route === '/home' }"
                  class="!my-0.5 !mx-3 !rounded-xl !text-stone-700 hover:!bg-stone-50 hover:!text-amber-800 transition-colors"
                  (click)="closeEvent.emit()"
                >
                  <mat-icon matListItemIcon class="text-stone-500">{{ item.icon }}</mat-icon>
                  <span matListItemTitle class="font-medium text-[13.5px]">{{ item.label }}</span>
                  @if (item.badge && item.badge > 0) {
                    <mat-icon
                      matListItemMeta
                      [matBadge]="item.badge"
                      matBadgeColor="accent"
                      matBadgeSize="small"
                    >
                    </mat-icon>
                  }
                </a>
              }
            </mat-nav-list>
          </div>
          <mat-divider class="!my-2" />
        }
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-stone-100 shrink-0 bg-stone-50/60">
        <p class="text-xs text-stone-400 text-center font-medium m-0">Nisha Pure Oils &amp; Agro v2.0</p>
      </div>
    </nav>
  `,
  styles: [],
})
export class SidebarComponent {
  readonly isOpen     = input.required<boolean>();
  readonly closeEvent = output<void>();

  readonly navSections: NavSection[] = [
    {
      title: 'Our Catalog',
      items: [
        { label: 'Home',           icon: 'home',         route: '/home' },
        { label: 'All Products',   icon: 'inventory_2',  route: '/products' },
        { label: 'Categories',     icon: 'category',     route: '/categories' },
        { label: 'Our Brands',     icon: 'verified',     route: '/brands' },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About Us',       icon: 'info',         route: '/about' },
        { label: 'Contact & Bulk', icon: 'contact_mail', route: '/contact' },
      ],
    },
    {
      title: 'Shopping',
      items: [
        { label: 'Cart',           icon: 'shopping_cart',route: '/cart', badge: 0 },
        { label: 'Wishlist',       icon: 'favorite',     route: '/wishlist', requiresAuth: true },
        { label: 'Checkout',       icon: 'payment',      route: '/checkout', requiresAuth: true },
      ],
    },
    {
      title: 'My Account',
      items: [
        { label: 'Profile',        icon: 'person',       route: '/profile', requiresAuth: true },
        { label: 'My Orders',      icon: 'receipt_long', route: '/orders', requiresAuth: true },
        { label: 'Addresses',      icon: 'location_on',  route: '/addresses', requiresAuth: true },
      ],
    },
  ];
}
