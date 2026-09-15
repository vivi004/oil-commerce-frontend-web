import { Injectable, signal, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/product.model';

const WISHLIST_STORAGE_KEY = 'shopzone_wishlist_items';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly toastr = inject(ToastrService);
  private readonly _items = signal<Product[]>(this.loadWishlist());

  readonly items = this._items.asReadonly();

  isInWishlist(productId: string): boolean {
    return this._items().some(p => p.id === productId);
  }

  toggleWishlist(product: Product): boolean {
    const current = this._items();
    const exists = current.some(p => p.id === product.id);

    if (exists) {
      const updated = current.filter(p => p.id !== product.id);
      this._items.set(updated);
      this.saveWishlist(updated);
      this.toastr.info(`Removed ${product.name.slice(0, 25)} from wishlist.`);
      return false;
    } else {
      const updated = [...current, product];
      this._items.set(updated);
      this.saveWishlist(updated);
      this.toastr.success(`Added ${product.name.slice(0, 25)} to wishlist!`, 'Saved to Wishlist');
      return true;
    }
  }

  removeFromWishlist(productId: string): void {
    const updated = this._items().filter(p => p.id !== productId);
    this._items.set(updated);
    this.saveWishlist(updated);
  }

  private loadWishlist(): Product[] {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (_err) {
      // Ignore parse error and return empty array
    }
    return [];
  }

  private saveWishlist(items: Product[]): void {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (_err) {
      // Ignore storage write errors
    }
  }
}
