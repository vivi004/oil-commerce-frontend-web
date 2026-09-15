import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductVariant, WeightVariant } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { APP_CONSTANTS } from '../constants/app.constants';

const CART_STORAGE_KEY = 'nisha_pure_oils_cart_items';
const COUPON_STORAGE_KEY = 'nisha_pure_oils_applied_coupon';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly toastr = inject(ToastrService);

  private readonly _items = signal<CartItem[]>(this.loadCartFromStorage());
  private readonly _couponCode = signal<string | null>(this.loadCouponFromStorage());

  readonly items = this._items.asReadonly();
  readonly couponCode = this._couponCode.asReadonly();

  readonly itemCount = computed(() => {
    return this._items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this._items().reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= APP_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : APP_CONSTANTS.DEFAULT_SHIPPING_COST;
  });

  readonly discountAmount = computed(() => {
    const code = this._couponCode();
    const sub = this.subtotal();
    if (!code || sub === 0) return 0;
    if (code.toUpperCase() === 'SAVE20' || code.toUpperCase() === 'PURE20') return Math.round(sub * 0.2);
    if (code.toUpperCase() === 'WELCOME10' || code.toUpperCase() === 'NISHA10') return Math.round(sub * 0.1);
    if (code.toUpperCase() === 'FIRSTOIL') return Math.min(150, Math.round(sub * 0.15));
    return 0;
  });

  readonly taxAmount = computed(() => {
    const taxableAmount = Math.max(0, this.subtotal() - this.discountAmount());
    return Math.round(taxableAmount * 0.05); // 5% GST on edible & traditional oils
  });

  readonly total = computed(() => {
    if (this._items().length === 0) return 0;
    return Math.max(0, this.subtotal() - this.discountAmount() + this.shippingCost() + this.taxAmount());
  });

  addToCart(
    product: Product,
    quantity = 1,
    weightVariant?: WeightVariant,
    legacyVariant?: ProductVariant,
  ): void {
    const currentItems = [...this._items()];
    const variantCode = weightVariant?.code || legacyVariant?.id;
    const variantLabel = weightVariant?.label || legacyVariant?.name;

    const existingIndex = currentItems.findIndex(
      (item) => item.productId === product.id && item.selectedVariantCode === variantCode,
    );

    const unitPrice = weightVariant?.price ?? legacyVariant?.price ?? product.price;

    if (existingIndex > -1) {
      const newQty = currentItems[existingIndex].quantity + quantity;
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: newQty,
        totalPrice: newQty * unitPrice,
      };
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        product,
        variantId: legacyVariant?.id,
        variant: legacyVariant,
        selectedVariantCode: variantCode,
        selectedVariantLabel: variantLabel,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        addedAt: new Date().toISOString(),
      };
      currentItems.push(newItem);
    }

    this._items.set(currentItems);
    this.saveCartToStorage(currentItems);
    const labelStr = variantLabel ? ` (${variantLabel})` : '';
    this.toastr.success(`Added ${product.name.slice(0, 26)}...${labelStr} to cart!`, 'Cart Updated');
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    const currentItems = this._items().map((item) => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    });

    this._items.set(currentItems);
    this.saveCartToStorage(currentItems);
  }

  removeFromCart(cartItemId: string): void {
    const itemToRemove = this._items().find((i) => i.id === cartItemId);
    const updated = this._items().filter((item) => item.id !== cartItemId);
    this._items.set(updated);
    this.saveCartToStorage(updated);
    if (itemToRemove) {
      this.toastr.info(`Removed ${itemToRemove.product.name.slice(0, 25)} from cart.`);
    }
  }

  applyCoupon(code: string): boolean {
    const trimmed = code.trim().toUpperCase();
    const validCodes = ['SAVE20', 'PURE20', 'WELCOME10', 'NISHA10', 'FIRSTOIL'];

    if (validCodes.includes(trimmed)) {
      this._couponCode.set(trimmed);
      this.saveCouponToStorage(trimmed);
      this.toastr.success(`Promo code "${trimmed}" applied successfully!`, 'Discount Active');
      return true;
    } else {
      this.toastr.error('Invalid coupon code. Try PURE20, NISHA10, or SAVE20', 'Promo Code Error');
      return false;
    }
  }

  removeCoupon(): void {
    this._couponCode.set(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    this.toastr.info('Coupon removed.');
  }

  clearCart(): void {
    this._items.set([]);
    this._couponCode.set(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  private loadCouponFromStorage(): string | null {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private saveCouponToStorage(code: string): void {
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }
}
