import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product, WeightVariant, WeightVariantCode } from '../../../core/models/product.model';
import { ImageGalleryComponent } from '../../../shared/components/image-gallery/image-gallery.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink, MatButtonModule, MatIconModule, MatTabsModule,
    MatDividerModule, MatSlideToggleModule, FormsModule, ImageGalleryComponent,
    RatingComponent, ProductCardComponent
  ],
  template: `
    @if (product(); as prod) {
      <div class="page-container section-padding">
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-8 flex-wrap">
          <a routerLink="/home" class="text-stone-600 no-underline hover:text-amber-800 font-medium">Home</a>
          <mat-icon class="!text-sm !w-3.5 !h-3.5 text-stone-400">chevron_right</mat-icon>
          <a routerLink="/products" class="text-stone-600 no-underline hover:text-amber-800 font-medium">Products</a>
          <mat-icon class="!text-sm !w-3.5 !h-3.5 text-stone-400">chevron_right</mat-icon>
          @if (prod.category) {
            <a [routerLink]="['/products']" [queryParams]="{ category: prod.category.slug }" class="text-stone-600 no-underline hover:text-amber-800 font-medium">
              {{ prod.category.name }}
            </a>
            <mat-icon class="!text-sm !w-3.5 !h-3.5 text-stone-400">chevron_right</mat-icon>
          }
          <span class="text-stone-900 font-semibold truncate max-w-xs">{{ prod.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-16 items-start">
          <!-- Left 6 cols: Gallery & Certifications -->
          <div class="lg:col-span-6 flex flex-col gap-6">
            <app-image-gallery [images]="prod.images" [altText]="prod.name" />

            <!-- Extraction & Quality Badges -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-start gap-3">
                <span class="text-2xl leading-none">🪵</span>
                <div>
                  <strong class="text-xs text-stone-900 block font-bold">Extraction</strong>
                  <p class="text-[11.5px] text-stone-600 mt-0.5 leading-snug">{{ prod.extractionMethod ?? 'Cold Pressed (Marachekku)' }}</p>
                </div>
              </div>
              <div class="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-start gap-3">
                <span class="text-2xl leading-none">📜</span>
                <div>
                  <strong class="text-xs text-stone-900 block font-bold">Certification</strong>
                  <p class="text-[11.5px] text-stone-600 mt-0.5 leading-snug">FSSAI: 12423008000456</p>
                </div>
              </div>
              <div class="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-start gap-3">
                <span class="text-2xl leading-none">🔬</span>
                <div>
                  <strong class="text-xs text-stone-900 block font-bold">Purity Standard</strong>
                  <p class="text-[11.5px] text-stone-600 mt-0.5 leading-snug">{{ prod.purity ?? '100% Raw Virgin Unrefined' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right 6 cols: Purchase Controls -->
          <div class="lg:col-span-6 flex flex-col">
            <div class="flex items-center gap-2.5 mb-3.5 flex-wrap">
              <span
                class="text-xs font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 py-1 px-3 rounded-full border border-amber-200"
                [class.!bg-yellow-100]="prod.brand === 'Varshini Gold'"
                [class.!text-yellow-900]="prod.brand === 'Varshini Gold'"
                [class.!border-yellow-200]="prod.brand === 'Varshini Gold'"
              >
                {{ prod.brand ?? 'Nisha Pure Oils' }}
              </span>
              <span class="text-xs font-bold text-red-600" [class.!text-emerald-700]="currentStock() > 0">
                {{ currentStock() > 0 ? '● In Stock (' + currentStock() + ' available)' : '● Out of Stock' }}
              </span>
              @if (prod.discount && prod.discount > 0) {
                <span class="bg-red-700 text-white text-[11px] font-extrabold py-0.5 px-2.5 rounded-full shadow-xs">Save {{ prod.discount }}%</span>
              }
            </div>

            <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mb-3.5 leading-tight">{{ prod.name }}</h1>

            <div class="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13.5px] text-stone-600 mb-6 flex-wrap">
              <span>SKU: <strong class="text-stone-900 font-bold">{{ currentSku() }}</strong></span>
              <span>Origin: <strong class="text-stone-900 font-bold">{{ prod.origin ?? 'Tamil Nadu' }}</strong></span>
              <div>
                <app-rating [value]="prod.rating" [reviewCount]="prod.reviewCount" />
              </div>
            </div>

            <!-- Price Card -->
            <div class="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 sm:p-6 mb-6">
              <div class="flex items-baseline gap-3 mb-1.5">
                <span class="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-amber-700">₹{{ currentPrice() }}</span>
                @if (currentComparePrice()) {
                  <span class="text-lg text-stone-400 line-through">₹{{ currentComparePrice() }}</span>
                  <span class="bg-amber-100 text-amber-900 text-xs font-bold py-1 px-2.5 rounded-md">Save ₹{{ currentComparePrice()! - currentPrice() }}</span>
                }
              </div>
              <p class="text-xs sm:text-[13px] text-stone-500 m-0">Inclusive of all taxes. Free express shipping across Tamil Nadu on orders above ₹499.</p>
            </div>

            <p class="text-sm sm:text-[15px] leading-relaxed text-stone-600 mb-6">{{ prod.shortDescription ?? prod.description }}</p>

            <!-- Weight / Volume Variant Selector -->
            <div class="bg-white border border-stone-200/90 rounded-2xl p-5 mb-6">
              <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                <label class="text-sm font-bold text-stone-900">
                  Select Size / Weight Variant:
                  <strong class="text-amber-800 ml-1 font-extrabold">{{ selectedVariant()?.label || '1L' }}</strong>
                </label>
                <!-- Admin toggle simulator launcher -->
                <button
                  type="button"
                  class="bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold py-1 px-3.5 flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-amber-200 shadow-xs"
                  (click)="toggleAdminDrawer()"
                  title="Store Admin: Configure which variants are enabled on/off"
                >
                  <mat-icon class="!text-base !w-4 !h-4">tune</mat-icon> Admin Variant Settings
                </button>
              </div>

              <div class="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 mb-3">
                @for (v of allVariants(); track v.code) {
                  <button
                    type="button"
                    class="bg-stone-50 border-2 border-stone-200 rounded-xl py-2.5 px-2 flex flex-col items-center cursor-pointer transition-all hover:border-amber-500 hover:bg-amber-50"
                    [class.!border-amber-700]="selectedVariantCode() === v.code"
                    [class.!bg-amber-100/70]="selectedVariantCode() === v.code"
                    [class.shadow-sm]="selectedVariantCode() === v.code"
                    [class.opacity-45]="!v.enabled || v.stock === 0"
                    [class.cursor-not-allowed]="!v.enabled || v.stock === 0"
                    [class.!bg-stone-100]="!v.enabled || v.stock === 0"
                    [disabled]="!v.enabled || v.stock === 0"
                    (click)="selectVariant(v)"
                  >
                    <span class="text-[14px] font-bold" [class.text-amber-950]="selectedVariantCode() === v.code" [class.text-stone-900]="selectedVariantCode() !== v.code">{{ v.label }}</span>
                    <span class="text-xs font-extrabold text-amber-700 mt-0.5">₹{{ v.price }}</span>
                    @if (!v.enabled) {
                      <span class="text-[10px] font-bold text-red-600 mt-0.5">Disabled</span>
                    } @else if (v.stock === 0) {
                      <span class="text-[10px] font-bold text-red-600 mt-0.5">Sold Out</span>
                    }
                  </button>
                }
              </div>
              <p class="text-xs text-stone-500 m-0">
                💡 5L family cans and 15L commercial tins come sealed with tamper-evident safety foil.
              </p>
            </div>

            <!-- Admin Drawer / Panel -->
            @if (showAdminDrawer()) {
              <div class="bg-amber-50/70 border-2 border-dashed border-amber-600 rounded-2xl p-5 mb-6 animate-fade-in">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex items-center gap-2.5">
                    <mat-icon color="primary">admin_panel_settings</mat-icon>
                    <div>
                      <strong class="text-sm font-bold text-amber-950">Admin Variant Availability Control</strong>
                      <p class="text-xs text-amber-800 mt-0.5">Turn on/off weight variants or update stock for <em>{{ prod.name }}</em></p>
                    </div>
                  </div>
                  <button class="bg-transparent border-0 text-lg font-bold text-amber-900 cursor-pointer hover:text-red-700" (click)="toggleAdminDrawer()">✕</button>
                </div>
                <div class="flex flex-col gap-2">
                  @for (v of allVariants(); track v.code) {
                    <div class="flex items-center justify-between bg-white border border-amber-200 rounded-xl p-3 px-4 text-xs sm:text-sm flex-wrap gap-2 shadow-xs" [class.!bg-red-50]="!v.enabled" [class.!border-red-200]="!v.enabled">
                      <div class="font-bold sm:min-w-[110px]">
                        <strong>{{ v.code }}</strong> ({{ v.label }})
                      </div>
                      <div class="font-extrabold text-amber-700 min-w-[70px]">
                        ₹{{ v.price }}
                      </div>
                      <div class="flex items-center">
                        <span class="text-stone-600 mr-1.5">Stock:</span>
                        <input
                          type="number"
                          [value]="v.stock"
                          [disabled]="!v.enabled"
                          min="0"
                          (change)="updateStock(v.code, $event)"
                          class="w-16 h-8 border border-stone-300 rounded-lg px-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <mat-slide-toggle
                          color="primary"
                          [checked]="v.enabled"
                          (change)="toggleVariantAvailability(v.code, $event.checked)"
                        >
                          {{ v.enabled ? 'Enabled' : 'Disabled' }}
                        </mat-slide-toggle>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Purchase Controls (Stepper, Add to Cart, Buy Now, Wishlist) -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <!-- Quantity Stepper -->
              <div class="flex items-center justify-center border-2 border-stone-200 rounded-full py-1 px-2 bg-white shrink-0">
                <button
                  mat-icon-button
                  [disabled]="quantity <= 1"
                  (click)="decrementQuantity()"
                  aria-label="Decrease quantity"
                  class="!w-9 !h-9"
                >
                  <mat-icon class="!text-base">remove</mat-icon>
                </button>
                <span class="w-10 text-center font-bold text-base text-stone-900">{{ quantity }}</span>
                <button
                  mat-icon-button
                  [disabled]="quantity >= currentStock()"
                  (click)="incrementQuantity()"
                  aria-label="Increase quantity"
                  class="!w-9 !h-9"
                >
                  <mat-icon class="!text-base">add</mat-icon>
                </button>
              </div>

              <!-- Add to Cart -->
              <button
                mat-raised-button
                color="primary"
                class="!h-12 !px-8 !rounded-full !text-[15px] !font-bold shadow-md shadow-amber-900/30 flex-1 flex items-center justify-center gap-2"
                [disabled]="currentStock() <= 0"
                (click)="addToCart(prod)"
              >
                <mat-icon>shopping_bag</mat-icon>
                <span>Add to Cart</span>
              </button>

              <!-- Buy Now -->
              <button
                mat-raised-button
                color="accent"
                class="!h-12 !px-7 !rounded-full !text-[15px] !font-bold flex-1 flex items-center justify-center gap-2 shadow-md shadow-green-900/20"
                [disabled]="currentStock() <= 0"
                (click)="buyNow(prod)"
              >
                <span>⚡ Buy Now</span>
              </button>

              <!-- Wishlist Heart -->
              <button
                mat-icon-button
                class="!border-2 !border-stone-200 !rounded-full !w-12 !h-12 flex items-center justify-center shrink-0 hover:!border-red-400"
                [class.!text-red-500]="isWishlisted(prod.id)"
                [class.!border-red-500]="isWishlisted(prod.id)"
                (click)="toggleWishlist(prod)"
                aria-label="Toggle wishlist"
              >
                <mat-icon>{{ isWishlisted(prod.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
              </button>
            </div>

            <!-- Features Guarantees Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-stone-200/90 rounded-2xl p-5">
              <div class="flex items-center gap-3.5">
                <mat-icon class="text-amber-700 !text-2xl !w-6 !h-6">local_shipping</mat-icon>
                <div>
                  <strong class="text-xs sm:text-sm text-stone-900 block font-bold">Free Express Delivery</strong>
                  <p class="text-xs text-stone-500 m-0">On orders over ₹499 across TN</p>
                </div>
              </div>
              <div class="flex items-center gap-3.5">
                <mat-icon class="text-amber-700 !text-2xl !w-6 !h-6">verified</mat-icon>
                <div>
                  <strong class="text-xs sm:text-sm text-stone-900 block font-bold">100% Wood Pressed</strong>
                  <p class="text-xs text-stone-500 m-0">Below 40°C slow Vaagai churn</p>
                </div>
              </div>
              <div class="flex items-center gap-3.5">
                <mat-icon class="text-amber-700 !text-2xl !w-6 !h-6">health_and_safety</mat-icon>
                <div>
                  <strong class="text-xs sm:text-sm text-stone-900 block font-bold">Zero Chemicals</strong>
                  <p class="text-xs text-stone-500 m-0">No solvent or mineral oil</p>
                </div>
              </div>
              <div class="flex items-center gap-3.5">
                <mat-icon class="text-amber-700 !text-2xl !w-6 !h-6">support_agent</mat-icon>
                <div>
                  <strong class="text-xs sm:text-sm text-stone-900 block font-bold">Farmer Mill Care</strong>
                  <p class="text-xs text-stone-500 m-0">Direct from Kangeyam facility</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Tabs -->
        <div class="bg-white border border-stone-200/90 rounded-3xl overflow-hidden mb-16 shadow-xs">
          <mat-tab-group animationDuration="200ms">
            <!-- 1. Description Tab -->
            <mat-tab label="Product Details">
              <div class="p-6 sm:p-10">
                <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-4">About This Oil</h3>
                <p class="text-sm sm:text-base leading-relaxed text-stone-600 mb-8 max-w-4xl">{{ prod.description }}</p>

                <div class="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-1">
                    <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">Extraction Method</span>
                    <span class="text-sm font-bold text-stone-900">{{ prod.extractionMethod ?? 'Traditional Cold Press' }}</span>
                  </div>
                  <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-1">
                    <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">Smoke Point</span>
                    <span class="text-sm font-bold text-stone-900">{{ prod.smokePoint ?? 'High Heat Stable' }}</span>
                  </div>
                  <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-1">
                    <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">Shelf Life</span>
                    <span class="text-sm font-bold text-stone-900">{{ prod.shelfLife ?? '12 Months' }}</span>
                  </div>
                  <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-1">
                    <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">Region of Origin</span>
                    <span class="text-sm font-bold text-stone-900">{{ prod.origin ?? 'Tamil Nadu, India' }}</span>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- 2. Benefits Tab -->
            <mat-tab label="Health & Usage Benefits">
              <div class="p-6 sm:p-10">
                <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-4">Key Health &amp; Wellness Advantages</h3>
                @if (prod.benefits && prod.benefits.length > 0) {
                  <ul class="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    @for (benefit of prod.benefits; track benefit) {
                      <li class="flex items-start gap-3 bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-sm font-medium text-stone-900">
                        <mat-icon class="text-emerald-700 !text-xl !w-5 !h-5 shrink-0">check_circle</mat-icon>
                        <span>{{ benefit }}</span>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="text-sm sm:text-base leading-relaxed text-stone-600">Rich in natural antioxidants, polyphenols, and essential fatty acids for culinary and wellness usage.</p>
                }
              </div>
            </mat-tab>

            <!-- 3. Nutritional Information Tab -->
            <mat-tab label="Nutritional Information">
              <div class="p-6 sm:p-10">
                <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-2">Nutritional Value (per 100g)</h3>
                <p class="text-xs sm:text-sm text-stone-500 mb-6">Tested and certified by NABL Accredited Food Laboratory.</p>
                @if (prod.nutritionalInfo && prod.nutritionalInfo.length > 0) {
                  <div class="overflow-x-auto border border-stone-200 rounded-2xl">
                    <table class="w-full border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr>
                          <th class="bg-amber-100/80 text-amber-950 font-bold p-3.5 px-5 text-left border-b border-amber-200">Nutrient</th>
                          <th class="bg-amber-100/80 text-amber-950 font-bold p-3.5 px-5 text-left border-b border-amber-200">Amount (Per 100g)</th>
                          <th class="bg-amber-100/80 text-amber-950 font-bold p-3.5 px-5 text-left border-b border-amber-200">% Daily Value</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-stone-200">
                        @for (fact of prod.nutritionalInfo; track fact.nutrient) {
                          <tr class="hover:bg-stone-50 transition-colors">
                            <td class="p-3.5 px-5 text-stone-900 font-semibold">{{ fact.nutrient }}</td>
                            <td class="p-3.5 px-5 font-bold text-amber-800">{{ fact.amountPer100g }}</td>
                            <td class="p-3.5 px-5 text-stone-500">{{ fact.dailyValue ?? '—' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </mat-tab>

            <!-- 4. Customer Reviews Tab -->
            <mat-tab label="Customer Reviews ({{ prod.reviewCount }})">
              <div class="p-6 sm:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center bg-stone-50 rounded-2xl p-6 sm:p-8">
                  <div class="flex flex-col items-start md:items-center gap-2 md:border-r border-b md:border-b-0 border-stone-200 md:pr-10 pb-6 md:pb-0 w-full md:w-auto">
                    <span class="font-['Outfit',sans-serif] text-4xl sm:text-5xl font-extrabold text-amber-700 leading-none">{{ prod.rating.toFixed(1) }}</span>
                    <app-rating [value]="prod.rating" [showValue]="false" />
                    <span class="text-xs text-stone-400">Based on {{ prod.reviewCount }} verified purchases</span>
                  </div>
                  <div class="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold text-emerald-800">
                    <div class="flex items-center gap-2">
                      <span>✓ 98% customer approval on wood-pressed aroma</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span>✓ 95% noted high crispness and low oil consumption</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span>✓ 100% verified genuine FSSAI food grade standard</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Related Oils & Products -->
        @if (relatedProducts().length > 0) {
          <div>
            <h2 class="font-['Outfit',sans-serif] text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 mb-8">You May Also Like</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              @for (rel of relatedProducts(); track rel.id) {
                <app-product-card [product]="rel" />
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [],
})
export class ProductDetailsComponent implements OnInit {
  private readonly route           = inject(ActivatedRoute);
  private readonly router          = inject(Router);
  private readonly productService  = inject(ProductService);
  private readonly cartService     = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastr          = inject(ToastrService);

  readonly product = signal<Product | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly selectedVariantCode = signal<WeightVariantCode | null>(null);
  readonly showAdminDrawer = signal(false);

  quantity = 1;

  readonly allVariants = computed(() => {
    return this.product()?.weightVariants || [];
  });

  readonly selectedVariant = computed<WeightVariant | undefined>(() => {
    const list = this.allVariants();
    const code = this.selectedVariantCode();
    if (code) {
      const match = list.find((v) => v.code === code);
      if (match && match.enabled) return match;
    }
    // Default to 1L if enabled, else first enabled variant
    const def1L = list.find((v) => v.code === '1L' && v.enabled);
    if (def1L) return def1L;
    return list.find((v) => v.enabled);
  });

  readonly currentPrice = computed(() => {
    return this.selectedVariant()?.price ?? this.product()?.price ?? 0;
  });

  readonly currentComparePrice = computed(() => {
    return this.selectedVariant()?.compareAtPrice ?? this.product()?.compareAtPrice;
  });

  readonly currentStock = computed(() => {
    return this.selectedVariant()?.stock ?? this.product()?.stock ?? 0;
  });

  readonly currentSku = computed(() => {
    return this.selectedVariant()?.sku ?? this.product()?.sku ?? '';
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        const firstEnabled = prod.weightVariants?.find((v) => v.code === '1L' && v.enabled) ||
                             prod.weightVariants?.find((v) => v.enabled);
        if (firstEnabled) {
          this.selectedVariantCode.set(firstEnabled.code);
        }
        this.quantity = 1;

        this.productService.getProducts({ categoryId: prod.categoryId, pageSize: 4 }).subscribe((res) => {
          this.relatedProducts.set(res.items.filter((p) => p.id !== prod.id).slice(0, 4));
        });
      },
      error: () => {
        this.toastr.error('Product not found.', 'Error');
        this.router.navigate(['/products']);
      },
    });
  }

  selectVariant(v: WeightVariant): void {
    if (!v.enabled || v.stock === 0) return;
    this.selectedVariantCode.set(v.code);
    this.quantity = 1;
  }

  toggleAdminDrawer(): void {
    this.showAdminDrawer.update((v) => !v);
  }

  toggleVariantAvailability(code: WeightVariantCode, enabled: boolean): void {
    const p = this.product();
    if (!p) return;
    this.productService.toggleProductVariant(p.id, code, enabled).subscribe((updated) => {
      this.product.set({ ...updated });
      this.toastr.info(`Variant ${code} is now ${enabled ? 'Enabled' : 'Disabled'}.`, 'Admin Setting Updated');
    });
  }

  updateStock(code: WeightVariantCode, event: Event): void {
    const p = this.product();
    if (!p) return;
    const val = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.productService.updateProductVariantStock(p.id, code, val).subscribe((updated) => {
      this.product.set({ ...updated });
      this.toastr.success(`Stock for ${code} set to ${val}`, 'Stock Updated');
    });
  }

  incrementQuantity(): void {
    if (this.quantity < this.currentStock()) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(prod: Product): void {
    const variant = this.selectedVariant();
    this.cartService.addToCart(prod, this.quantity, variant);
  }

  buyNow(prod: Product): void {
    const variant = this.selectedVariant();
    this.cartService.addToCart(prod, this.quantity, variant);
    this.router.navigate(['/checkout']);
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(prod: Product): void {
    this.wishlistService.toggleWishlist(prod);
  }
}
