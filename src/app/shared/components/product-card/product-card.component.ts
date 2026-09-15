import { Component, input, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product, WeightVariant } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, RatingComponent],
  template: `
    <div class="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-600/40 relative h-full">
      <!-- Media: Image + Badges + Quick Add -->
      <div class="relative w-full h-48 sm:h-52 bg-[#fbf9f4] overflow-hidden">
        <a [routerLink]="['/products', product().id]" class="block w-full h-full">
          <img
            [src]="product().thumbnail"
            [alt]="product().name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </a>

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-[2]">
          @if (product().isOnSale) {
            <span class="text-[10px] sm:text-[11px] font-extrabold py-0.5 px-2 rounded-md uppercase tracking-wider bg-red-700 text-white shadow-xs">
              Sale
            </span>
          }
          @if (product().isFeatured) {
            <span class="text-[10px] sm:text-[11px] font-extrabold py-0.5 px-2 rounded-md uppercase tracking-wider bg-amber-700 text-amber-100 shadow-xs">
              Bestseller
            </span>
          }
          @if (product().extractionMethod?.includes('Wood')) {
            <span class="text-[10px] sm:text-[11px] font-extrabold py-0.5 px-2 rounded-md uppercase tracking-wider bg-emerald-800 text-emerald-100 shadow-xs">
              Marachekku
            </span>
          }
        </div>

        <!-- Wishlist Button -->
        <button
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 flex items-center justify-center cursor-pointer text-stone-400 z-[2] transition-all hover:bg-white hover:text-red-500 hover:scale-110 shadow-xs"
          [class.!text-red-500]="isWishlisted()"
          [class.!bg-white]="isWishlisted()"
          (click)="onToggleWishlist($event)"
          matTooltip="Add to Wishlist"
          aria-label="Wishlist"
        >
          <mat-icon class="!text-[20px] !w-5 !h-5">{{ isWishlisted() ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>

        <!-- Quick Add Overlay Button -->
        <button
          class="absolute bottom-3 left-3 right-3 h-10 bg-stone-900/90 backdrop-blur-md text-amber-200 border border-amber-200/30 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-[3] hover:!bg-amber-700 hover:!text-white hover:!border-amber-700 shadow-md"
          (click)="onAddToCart($event)"
          aria-label="Add to cart"
        >
          <mat-icon class="!text-base !w-4 !h-4">shopping_bag</mat-icon>
          <span>Quick Add ({{ activeVariant()?.label || '1L' }})</span>
        </button>
      </div>

      <!-- Card Info -->
      <div class="p-4 sm:p-5 flex flex-col flex-1 gap-2.5">
        <div class="flex items-center justify-between gap-2">
          <span
            class="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md"
            [class.!text-amber-950]="product().brand === 'Varshini Gold'"
            [class.!bg-yellow-100]="product().brand === 'Varshini Gold'"
          >
            {{ product().brand ?? 'Nisha Pure Oils' }}
          </span>
          @if (product().category) {
            <span class="text-xs text-stone-400 truncate">{{ product().category?.name }}</span>
          }
        </div>

        <h3 class="font-['Outfit',sans-serif] text-[15px] sm:text-[16px] font-bold leading-snug m-0 line-clamp-2 min-h-[42px]">
          <a [routerLink]="['/products', product().id]" [title]="product().name" class="text-stone-900 no-underline hover:text-amber-700 transition-colors">
            {{ product().name }}
          </a>
        </h3>

        <!-- Available Weight Variants selector -->
        @if (enabledVariants().length > 0) {
          <div class="flex flex-wrap gap-1.5 mt-0.5" (click)="$event.stopPropagation()">
            @for (v of enabledVariants(); track v.code) {
              <button
                type="button"
                class="text-[11px] font-bold py-0.5 px-2 rounded-md border border-stone-200 bg-stone-50 text-stone-600 cursor-pointer transition-all hover:border-amber-600 hover:text-amber-800"
                [class.!border-amber-700]="selectedVariantCode() === v.code"
                [class.!bg-amber-100]="selectedVariantCode() === v.code"
                [class.!text-amber-900]="selectedVariantCode() === v.code"
                (click)="selectVariant(v, $event)"
              >
                {{ v.label }}
              </button>
            }
          </div>
        }

        <!-- Rating -->
        <div class="flex items-center pt-1">
          <app-rating [value]="product().rating" [reviewCount]="product().reviewCount" />
        </div>

        <!-- Price & Bottom Actions -->
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <div class="flex items-baseline gap-2">
            <span class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-extrabold text-amber-700">₹{{ currentPrice() }}</span>
            @if (currentComparePrice()) {
              <span class="text-xs sm:text-sm text-stone-400 line-through">₹{{ currentComparePrice() }}</span>
            }
          </div>

          <button
            mat-icon-button
            class="!text-amber-800 !bg-amber-100/80 !rounded-xl !w-10 !h-10 hover:!bg-amber-700 hover:!text-white transition-all shadow-xs"
            (click)="onAddToCart($event)"
            matTooltip="Add to cart"
            aria-label="Add to Cart"
          >
            <mat-icon>add_shopping_cart</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly selectedVariantCode = signal<string | null>(null);

  readonly enabledVariants = computed(() => {
    const list = this.product().weightVariants || [];
    return list.filter((v) => v.enabled);
  });

  readonly activeVariant = computed<WeightVariant | undefined>(() => {
    const code = this.selectedVariantCode();
    const list = this.enabledVariants();
    if (code) {
      const match = list.find((v) => v.code === code);
      if (match) return match;
    }
    // Default to 1L or the first available variant
    const default1L = list.find((v) => v.code === '1L');
    return default1L || list[0];
  });

  readonly currentPrice = computed(() => {
    return this.activeVariant()?.price ?? this.product().price;
  });

  readonly currentComparePrice = computed(() => {
    return this.activeVariant()?.compareAtPrice ?? this.product().compareAtPrice;
  });

  selectVariant(v: WeightVariant, event: Event): void {
    event.stopPropagation();
    this.selectedVariantCode.set(v.code);
  }

  isWishlisted(): boolean {
    return this.wishlistService.isInWishlist(this.product().id);
  }

  onToggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product());
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(this.product(), 1, this.activeVariant());
  }
}
