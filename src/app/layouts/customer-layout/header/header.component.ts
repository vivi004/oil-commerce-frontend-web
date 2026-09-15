import { Component, output, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { selectCurrentUser, selectIsAuthenticated } from '../../../core/state/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatBadgeModule, MatTooltipModule, MatDividerModule,
  ],
  template: `
    <header class="sticky top-0 z-[var(--z-header)] shadow-xs bg-white/95 backdrop-blur-md transition-all">
      <!-- Top Announcement Bar -->
      <div class="bg-gradient-to-r from-[#241306] via-[#451f08] to-[#241306] text-amber-200 text-xs font-medium py-1.5 px-4 text-center tracking-wide border-b border-amber-950">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 flex justify-between items-center text-[12px] gap-2">
          <span class="hidden sm:inline-flex items-center gap-2 text-amber-300 font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Traditional Vaagai Wood Cold-Pressed (Marachekku)
          </span>
          <span class="mx-auto sm:mx-0 font-medium text-amber-100 flex items-center gap-1.5">
            <span>🌿</span>
            <span>Free Delivery across Tamil Nadu on orders above ₹499</span>
          </span>
          <a routerLink="/contact" class="hidden md:inline-flex items-center gap-1 text-amber-300 hover:text-white transition-colors underline font-medium">
            <span>📞 Direct Mill Desk: +91 98421 88990</span>
          </a>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="border-b border-stone-200/90">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 h-20 flex items-center justify-between gap-4 lg:gap-8">
          
          <!-- Left: Hamburger (mobile) + Brand Logo -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              mat-icon-button
              class="lg:!hidden !text-stone-700 hover:!bg-stone-100"
              (click)="menuToggle.emit()"
              matTooltip="Menu"
              aria-label="Toggle navigation menu"
            >
              <mat-icon>menu</mat-icon>
            </button>

            <a routerLink="/home" class="flex items-center gap-3 no-underline group py-1">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 group-hover:shadow-amber-900/30 transition-all shrink-0">
                <span class="text-2xl leading-none">🪔</span>
              </div>
              <div class="flex flex-col">
                <span class="font-['Outfit',sans-serif] text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-amber-800 transition-colors tracking-tight leading-none mb-1">
                  Nisha Pure Oils
                </span>
                <span class="text-[10.5px] font-bold text-amber-700 tracking-wider uppercase leading-none">
                  Wood Pressed &amp; Agro
                </span>
              </div>
            </a>
          </div>

          <!-- Center: Clean Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-1.5 xl:gap-2.5" aria-label="Main navigation">
            <a
              routerLink="/home"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              Home
            </a>
            <a
              routerLink="/products"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              All Oils
            </a>
            <a
              routerLink="/categories"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              Categories
            </a>
            <a
              routerLink="/brands"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              Our Brands
            </a>
            <a
              routerLink="/about"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              About
            </a>
            <a
              routerLink="/contact"
              routerLinkActive="!text-amber-900 !bg-amber-100/70 !font-bold"
              class="px-3.5 py-2 rounded-full text-[14px] font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-all no-underline"
            >
              Contact
            </a>
          </nav>

          <!-- Right: Search, Wishlist, Cart & Profile Actions -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <!-- Search Toggle -->
            <button
              mat-icon-button
              class="!text-stone-700 !w-10 !h-10 hover:!bg-stone-100 !rounded-full transition-colors"
              (click)="toggleSearch()"
              matTooltip="Search Products"
              aria-label="Search"
            >
              <mat-icon>{{ searchOpen() ? 'close' : 'search' }}</mat-icon>
            </button>

            <!-- Wishlist (authenticated) -->
            @if (isAuthenticated()) {
              <a
                routerLink="/wishlist"
                mat-icon-button
                class="!text-stone-700 !w-10 !h-10 hover:!bg-stone-100 !rounded-full hidden sm:inline-flex transition-colors"
                matTooltip="Wishlist"
                aria-label="Wishlist"
              >
                <mat-icon>favorite_border</mat-icon>
              </a>
            }

            <!-- Cart Pill Button -->
            <a
              routerLink="/cart"
              class="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-amber-900 transition-all no-underline shadow-xs hover:shadow-sm group"
              matTooltip="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <mat-icon class="!text-[20px] !w-5 !h-5 text-amber-700 group-hover:scale-110 transition-transform">shopping_bag</mat-icon>
              <span class="text-xs sm:text-[13px] font-extrabold text-amber-900">Cart</span>
              @if (cartCount() > 0) {
                <span class="w-5 h-5 rounded-full bg-amber-700 text-white text-[10.5px] font-extrabold flex items-center justify-center shadow-xs">
                  {{ cartCount() }}
                </span>
              }
            </a>

            <!-- User Menu / Sign In Button -->
            @if (isAuthenticated()) {
              <button
                mat-icon-button
                [matMenuTriggerFor]="userMenu"
                class="!w-10 !h-10 !p-0 overflow-hidden !rounded-full !border-2 !border-amber-600 hover:!border-amber-800 transition-all shadow-xs"
                aria-label="Account menu"
              >
                @if (currentUser()?.avatar) {
                  <img [src]="currentUser()!.avatar" alt="Avatar" class="w-full h-full object-cover" />
                } @else {
                  <span class="flex items-center justify-center w-full h-full bg-amber-700 text-white text-xs font-bold">{{ userInitials() }}</span>
                }
              </button>

              <mat-menu #userMenu="matMenu" xPosition="before">
                <div class="px-4 py-3 bg-stone-50 min-w-[210px]" (click)="$event.stopPropagation()">
                  <div class="font-bold text-sm text-stone-900">{{ userFullName() }}</div>
                  <div class="text-xs text-stone-500 mt-0.5">{{ currentUser()?.email }}</div>
                </div>
                <mat-divider />
                <a mat-menu-item routerLink="/profile">
                  <mat-icon class="text-stone-600">person_outline</mat-icon>
                  <span>My Profile</span>
                </a>
                <a mat-menu-item routerLink="/orders">
                  <mat-icon class="text-stone-600">receipt_long</mat-icon>
                  <span>My Orders</span>
                </a>
                <a mat-menu-item routerLink="/addresses">
                  <mat-icon class="text-stone-600">location_on</mat-icon>
                  <span>Saved Addresses</span>
                </a>
                <a mat-menu-item routerLink="/wishlist">
                  <mat-icon class="text-stone-600">favorite_border</mat-icon>
                  <span>Wishlist</span>
                </a>
                <mat-divider />
                <button mat-menu-item (click)="logout()" class="!text-red-600">
                  <mat-icon color="warn">logout</mat-icon>
                  <span>Sign Out</span>
                </button>
              </mat-menu>
            } @else {
              <a
                mat-raised-button
                color="primary"
                routerLink="/auth/login"
                class="!h-10 !px-5 !rounded-full !text-xs sm:!text-[13.5px] !font-bold shadow-xs hover:shadow-sm"
              >
                Sign In
              </a>
            }
          </div>
        </div>
      </div>

      <!-- Expandable Search Bar Drawer -->
      @if (searchOpen()) {
        <div class="bg-stone-50/95 backdrop-blur-md border-b border-stone-200 py-4 px-4 animate-fade-in shadow-inner">
          <div class="max-w-2xl mx-auto flex items-center bg-white border border-amber-600/40 rounded-full px-4 h-12 gap-3 shadow-md focus-within:border-amber-700 focus-within:ring-3 focus-within:ring-amber-700/20 transition-all">
            <mat-icon class="text-amber-700 !text-xl !w-5 !h-5 shrink-0">search</mat-icon>
            <input
              type="text"
              placeholder="Search wood pressed groundnut oil, virgin coconut oil, gingelly..."
              class="flex-1 border-0 bg-transparent outline-none text-[14px] text-stone-900 placeholder:text-stone-400"
              [value]="searchQuery()"
              (input)="onSearch($event)"
              (keyup.enter)="navigateToSearch()"
              aria-label="Search oils and products"
              autofocus
            />
            @if (searchQuery()) {
              <button class="bg-transparent border-0 p-1 cursor-pointer flex items-center text-stone-400 hover:text-stone-700 transition-colors rounded-full" (click)="clearSearch()" aria-label="Clear search">
                <mat-icon class="!text-base !w-4 !h-4">close</mat-icon>
              </button>
            }
            <button
              mat-flat-button
              color="primary"
              (click)="navigateToSearch()"
              class="!h-8.5 !px-5 !rounded-full !text-xs !font-bold shrink-0 shadow-xs"
            >
              Search
            </button>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class HeaderComponent {
  readonly menuToggle = output<void>();

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router      = inject(Router);
  private readonly store       = inject(Store);

  // Store signals
  readonly currentUser     = toSignal(this.store.select(selectCurrentUser), { initialValue: null });
  readonly isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), { initialValue: false });

  // Cart count signal
  readonly cartCount = this.cartService.itemCount;

  // Search state
  readonly searchQuery = signal('');
  readonly searchOpen  = signal(false);

  readonly userFullName = this.authService.userFullName;
  readonly userInitials = this.authService.userInitials;

  toggleSearch(): void {
    this.searchOpen.update((v) => !v);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  navigateToSearch(): void {
    const q = this.searchQuery().trim();
    if (q) {
      this.searchOpen.set(false);
      this.router.navigate(['/products/search'], { queryParams: { q } });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
