import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category, ProductFilter } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-list',
  imports: [
    MatButtonModule, MatIconModule, MatSelectModule,
    MatChipsModule, MatCheckboxModule, FormsModule, ProductCardComponent,
    PaginationComponent, EmptyStateComponent
  ],
  template: `
    <div class="page-container section-padding">
      <!-- Header -->
      <div class="mb-8 sm:mb-10">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1.5">Shop Pure &amp; Natural</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight m-0 text-stone-900">Traditional Oils &amp; Agro Products</h1>
        <p class="text-sm sm:text-base text-stone-600 mt-1.5 max-w-2xl">100% Vaagai Wood-Pressed, Refined Culinary, Herbal Extracts, and Traditional Agro Products</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        <!-- Desktop Filters Sidebar -->
        <aside class="hidden lg:block bg-white border border-stone-200/90 rounded-2xl p-6 sticky top-28 shadow-xs">
          <div class="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
            <h3 class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 m-0 flex items-center gap-2">
              <mat-icon class="text-amber-700 !text-xl !w-5 !h-5">tune</mat-icon>
              <span>Filters</span>
            </h3>
            <button mat-button color="primary" class="!text-xs !px-2.5 !min-w-0 !font-bold" (click)="resetFilters()">
              Reset All
            </button>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6 pb-5 border-b border-stone-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Brands</h4>
            <div class="flex flex-col gap-2">
              <mat-checkbox
                [checked]="isBrandSelected('Nisha Pure Oils')"
                (change)="toggleBrand('Nisha Pure Oils', $event.checked)"
                color="primary"
              >
                <span class="text-[13.5px] font-semibold text-stone-900">🌿 Nisha Pure Oils</span>
              </mat-checkbox>
              <mat-checkbox
                [checked]="isBrandSelected('Varshini Gold')"
                (change)="toggleBrand('Varshini Gold', $event.checked)"
                color="primary"
              >
                <span class="text-[13.5px] font-semibold text-stone-900">⭐ Varshini Gold</span>
              </mat-checkbox>
            </div>
          </div>

          <!-- Categories Filter -->
          <div class="mb-6 pb-5 border-b border-stone-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Categories</h4>
            <div class="flex flex-col gap-1">
              <button
                class="flex items-center justify-between py-2 px-3 rounded-lg border-0 bg-transparent text-[13.5px] text-stone-700 cursor-pointer text-left transition-all hover:bg-stone-50 hover:text-amber-800"
                [class.!bg-amber-100/80]="selectedCategoryId === null && selectedCategorySlug === null"
                [class.!text-amber-950]="selectedCategoryId === null && selectedCategorySlug === null"
                [class.font-bold]="selectedCategoryId === null && selectedCategorySlug === null"
                (click)="onSelectCategory(null)"
              >
                <span>All Categories</span>
              </button>
              @for (cat of categories(); track cat.id) {
                <button
                  class="flex items-center justify-between py-2 px-3 rounded-lg border-0 bg-transparent text-[13.5px] text-stone-700 cursor-pointer text-left transition-all hover:bg-stone-50 hover:text-amber-800"
                  [class.!bg-amber-100/80]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                  [class.!text-amber-950]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                  [class.font-bold]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                  (click)="onSelectCategory(cat.id, cat.slug)"
                >
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                  <span class="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">{{ cat.productCount }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="mb-6 pb-5 border-b border-stone-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Price Range (₹)</h4>
            <div class="flex items-center gap-2">
              <div class="flex-1 flex items-center bg-stone-50 border border-stone-200 rounded-lg px-2.5 h-10">
                <span class="text-stone-400 text-xs mr-1 font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="0"
                  class="w-full border-0 bg-transparent outline-none text-xs sm:text-[13px] text-stone-900 font-medium"
                  [(ngModel)]="minPrice"
                  (ngModelChange)="applyFilters()"
                />
              </div>
              <span class="text-stone-400 font-bold">—</span>
              <div class="flex-1 flex items-center bg-stone-50 border border-stone-200 rounded-lg px-2.5 h-10">
                <span class="text-stone-400 text-xs mr-1 font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="5000"
                  class="w-full border-0 bg-transparent outline-none text-xs sm:text-[13px] text-stone-900 font-medium"
                  [(ngModel)]="maxPrice"
                  (ngModelChange)="applyFilters()"
                />
              </div>
            </div>
          </div>

          <!-- Customer Rating Filter -->
          <div class="mb-6 pb-5 border-b border-stone-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Customer Rating</h4>
            @for (r of [4.5, 4.0]; track r) {
              <div class="flex items-center cursor-pointer py-1" (click)="setRating(r)">
                <mat-checkbox
                  [checked]="minRating === r"
                  color="primary"
                  (click)="$event.preventDefault()"
                >
                  <span class="text-[13.5px] text-stone-900 font-medium">{{ r }}★ &amp; above</span>
                </mat-checkbox>
              </div>
            }
          </div>

          <!-- Availability & Deals -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Offers &amp; Stock</h4>
            <div class="flex flex-col gap-1.5">
              <mat-checkbox [(ngModel)]="onSaleOnly" (ngModelChange)="applyFilters()" color="primary">
                <span class="text-[13.5px] font-medium text-stone-900">Discounted Deals</span>
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="inStockOnly" (ngModelChange)="applyFilters()" color="primary">
                <span class="text-[13.5px] font-medium text-stone-900">In Stock Only</span>
              </mat-checkbox>
            </div>
          </div>
        </aside>

        <!-- Products Main Column -->
        <div class="flex flex-col gap-6">
          <!-- Toolbar -->
          <div class="flex items-center justify-between p-3 sm:p-4 sm:px-6 gap-3 flex-wrap bg-white border border-stone-200/90 rounded-2xl shadow-xs">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold py-2 px-4 rounded-full cursor-pointer lg:hidden"
                (click)="mobileFiltersOpen.set(true)"
                aria-label="Open filter menu"
              >
                <mat-icon class="!text-lg !w-[18px] !h-[18px]">tune</mat-icon>
                <span>Filter</span>
                @if (activeFilterCount() > 0) {
                  <span class="bg-amber-700 text-white text-[10.5px] px-1.5 py-0.5 rounded-full font-bold">{{ activeFilterCount() }}</span>
                }
              </button>

              <p class="text-xs sm:text-sm text-stone-600 m-0">
                Showing <strong>{{ totalItems() }}</strong> products
                @if (selectedBrands.length > 0) {
                  <span class="hidden sm:inline">in <em>{{ selectedBrands.join(', ') }}</em></span>
                }
              </p>
            </div>

            <div class="flex items-center gap-2.5">
              <span class="text-xs sm:text-sm text-stone-600 whitespace-nowrap font-medium">Sort by:</span>
              <mat-select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="w-36 sm:w-44 text-xs sm:text-[13.5px]">
                <mat-option value="popularity">Popularity</mat-option>
                <mat-option value="price_asc">Price: Low to High</mat-option>
                <mat-option value="price_desc">Price: High to Low</mat-option>
                <mat-option value="rating">Highest Rated</mat-option>
                <mat-option value="newest">Newest Batches</mat-option>
              </mat-select>
            </div>
          </div>

          <!-- Products Grid or Empty State -->
          @if (products().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              @for (product of products(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>

            <!-- Reusable Pagination -->
            <app-pagination
              [page]="currentPage()"
              [totalPages]="totalPages()"
              (pageChange)="onPageChange($event)"
            />
          } @else {
            <app-empty-state
              icon="search_off"
              title="No oils found matching criteria"
              description="Try selecting another category, brand, or resetting your price filters."
              actionText="Reset All Filters"
              (click)="resetFilters()"
            />
          }
        </div>
      </div>

      <!-- Mobile Filters Slide-Over Drawer -->
      @if (mobileFiltersOpen()) {
        <div class="fixed inset-0 bg-black/60 z-[1000] backdrop-blur-xs flex justify-end animate-fade-in" (click)="mobileFiltersOpen.set(false)">
          <div class="w-[min(340px,88vw)] h-full bg-white flex flex-col shadow-2xl" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between p-4 px-5 border-b border-stone-200">
              <h3 class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 m-0">Filters &amp; Categories</h3>
              <div class="flex items-center gap-2">
                <button mat-button color="primary" class="!text-xs !px-2.5 !min-w-0 !font-bold" (click)="resetFilters()">
                  Reset
                </button>
                <button mat-icon-button (click)="mobileFiltersOpen.set(false)" aria-label="Close filters">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-5">
              <!-- Brand Filter -->
              <div class="mb-6 pb-5 border-b border-stone-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Brands</h4>
                <div class="flex flex-col gap-2">
                  <mat-checkbox
                    [checked]="isBrandSelected('Nisha Pure Oils')"
                    (change)="toggleBrand('Nisha Pure Oils', $event.checked)"
                    color="primary"
                  >
                    <span class="text-sm font-semibold text-stone-900">🌿 Nisha Pure Oils</span>
                  </mat-checkbox>
                  <mat-checkbox
                    [checked]="isBrandSelected('Varshini Gold')"
                    (change)="toggleBrand('Varshini Gold', $event.checked)"
                    color="primary"
                  >
                    <span class="text-sm font-semibold text-stone-900">⭐ Varshini Gold</span>
                  </mat-checkbox>
                </div>
              </div>

              <!-- Categories Filter -->
              <div class="mb-6 pb-5 border-b border-stone-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Categories</h4>
                <div class="flex flex-col gap-1">
                  <button
                    class="flex items-center justify-between py-2 px-3 rounded-lg border-0 bg-transparent text-sm text-stone-700 cursor-pointer text-left transition-all hover:bg-stone-50 hover:text-amber-800"
                    [class.!bg-amber-100/80]="selectedCategoryId === null && selectedCategorySlug === null"
                    [class.!text-amber-950]="selectedCategoryId === null && selectedCategorySlug === null"
                    [class.font-bold]="selectedCategoryId === null && selectedCategorySlug === null"
                    (click)="onSelectCategory(null)"
                  >
                    <span>All Categories</span>
                  </button>
                  @for (cat of categories(); track cat.id) {
                    <button
                      class="flex items-center justify-between py-2 px-3 rounded-lg border-0 bg-transparent text-sm text-stone-700 cursor-pointer text-left transition-all hover:bg-stone-50 hover:text-amber-800"
                      [class.!bg-amber-100/80]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                      [class.!text-amber-950]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                      [class.font-bold]="selectedCategoryId === cat.id || selectedCategorySlug === cat.slug"
                      (click)="onSelectCategory(cat.id, cat.slug)"
                    >
                      <span>{{ cat.icon }} {{ cat.name }}</span>
                      <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">{{ cat.productCount }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Price Range Filter -->
              <div class="mb-6 pb-5 border-b border-stone-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Price Range (₹)</h4>
                <div class="flex items-center gap-2">
                  <div class="flex-1 flex items-center bg-stone-50 border border-stone-200 rounded-lg px-2.5 h-10">
                    <span class="text-stone-400 text-xs mr-1 font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      class="w-full border-0 bg-transparent outline-none text-xs text-stone-900 font-medium"
                      [(ngModel)]="minPrice"
                      (ngModelChange)="applyFilters()"
                    />
                  </div>
                  <span class="text-stone-400 font-bold">—</span>
                  <div class="flex-1 flex items-center bg-stone-50 border border-stone-200 rounded-lg px-2.5 h-10">
                    <span class="text-stone-400 text-xs mr-1 font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="5000"
                      class="w-full border-0 bg-transparent outline-none text-xs text-stone-900 font-medium"
                      [(ngModel)]="maxPrice"
                      (ngModelChange)="applyFilters()"
                    />
                  </div>
                </div>
              </div>

              <!-- Rating Filter -->
              <div class="mb-6 pb-5 border-b border-stone-100">
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Customer Rating</h4>
                @for (r of [4.5, 4.0]; track r) {
                  <div class="flex items-center cursor-pointer py-1" (click)="setRating(r)">
                    <mat-checkbox
                      [checked]="minRating === r"
                      color="primary"
                      (click)="$event.preventDefault()"
                    >
                      <span class="text-sm text-stone-900 font-medium">{{ r }}★ &amp; above</span>
                    </mat-checkbox>
                  </div>
                }
              </div>

              <!-- Offers -->
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Offers &amp; Stock</h4>
                <div class="flex flex-col gap-1.5">
                  <mat-checkbox [(ngModel)]="onSaleOnly" (ngModelChange)="applyFilters()" color="primary">
                    <span class="text-sm font-medium text-stone-900">Discounted Deals</span>
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="inStockOnly" (ngModelChange)="applyFilters()" color="primary">
                    <span class="text-sm font-medium text-stone-900">In Stock Only</span>
                  </mat-checkbox>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-stone-200 bg-stone-50">
              <button mat-raised-button color="primary" class="w-full !h-11 !rounded-full !font-bold" (click)="mobileFiltersOpen.set(false)">
                Apply Filters ({{ totalItems() }} Products)
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly totalItems = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly mobileFiltersOpen = signal(false);

  selectedCategoryId: string | null = null;
  selectedCategorySlug: string | null = null;
  selectedBrands: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  onSaleOnly = false;
  inStockOnly = false;
  sortBy: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'popularity';

  activeFilterCount(): number {
    let count = 0;
    if (this.selectedCategoryId || this.selectedCategorySlug) count++;
    if (this.selectedBrands.length > 0) count += this.selectedBrands.length;
    if (this.minPrice !== null || this.maxPrice !== null) count++;
    if (this.minRating !== null) count++;
    if (this.onSaleOnly) count++;
    if (this.inStockOnly) count++;
    return count;
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe((cats) => {
      this.categories.set(cats);
    });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategorySlug = params['category'];
        const match = this.categories().find((c) => c.slug === params['category']);
        if (match) this.selectedCategoryId = match.id;
      }
      if (params['brand']) {
        this.selectedBrands = [params['brand']];
      }
      this.applyFilters();
    });
  }

  isBrandSelected(brandName: string): boolean {
    return this.selectedBrands.includes(brandName);
  }

  toggleBrand(brandName: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedBrands.includes(brandName)) {
        this.selectedBrands.push(brandName);
      }
    } else {
      this.selectedBrands = this.selectedBrands.filter((b) => b !== brandName);
    }
    this.applyFilters();
  }

  onSelectCategory(catId: string | null, catSlug?: string): void {
    this.selectedCategoryId = catId;
    this.selectedCategorySlug = catSlug ?? null;
    this.currentPage.set(1);
    this.applyFilters();
  }

  setRating(r: number): void {
    this.minRating = this.minRating === r ? null : r;
    this.applyFilters();
  }

  applyFilters(): void {
    const filter: ProductFilter = {
      categoryId: this.selectedCategorySlug ?? this.selectedCategoryId ?? undefined,
      brand: this.selectedBrands.length > 0 ? this.selectedBrands : undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      minRating: this.minRating ?? undefined,
      onSale: this.onSaleOnly || undefined,
      inStock: this.inStockOnly || undefined,
      sortBy: this.sortBy,
      page: this.currentPage(),
      pageSize: 12,
    };

    this.productService.getProducts(filter).subscribe((res) => {
      this.products.set(res.items);
      this.totalItems.set(res.totalItems ?? res.total);
      this.totalPages.set(res.totalPages);
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.selectedCategoryId = null;
    this.selectedCategorySlug = null;
    this.selectedBrands = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = null;
    this.onSaleOnly = false;
    this.inStockOnly = false;
    this.sortBy = 'popularity';
    this.currentPage.set(1);
    this.applyFilters();
  }
}
