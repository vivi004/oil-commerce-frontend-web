import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-wishlist',
  imports: [MatButtonModule, MatIconModule, ProductCardComponent, EmptyStateComponent],
  template: `
    <div class="page-container section-padding">
      <div class="mb-8 sm:mb-10">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Saved Favorites</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">My Wishlist</h1>
        <p class="text-sm sm:text-base text-stone-500 mt-1">
          You have saved <strong class="text-stone-800 font-bold">{{ wishlistService.items().length }}</strong> product{{ wishlistService.items().length === 1 ? '' : 's' }}
        </p>
      </div>

      @if (wishlistService.items().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          @for (product of wishlistService.items(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      } @else {
        <app-empty-state
          emoji="💝"
          title="Your Wishlist is Empty"
          description="Click the heart icon on any cold-pressed oil or traditional agro item to save your favorites here."
          actionText="Discover Products"
          actionLink="/products"
        />
      }
    </div>
  `,
  styles: [],
})
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
}
