import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-search',
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, ProductCardComponent, EmptyStateComponent
  ],
  template: `
    <div class="page-container py-6 sm:py-10">
      <div class="mb-6">
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900 m-0">
          @if (currentQuery()) {
            Results for "<em class="text-primary not-italic">{{ currentQuery() }}</em>"
          } @else {
            Search Traditional Oils
          }
        </h1>
        @if (hasSearched()) {
          <p class="text-xs sm:text-sm text-stone-500 mt-1.5">
            Found <strong class="text-stone-800">{{ searchResults().length }}</strong> product{{ searchResults().length === 1 ? '' : 's' }}
          </p>
        }
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 max-w-2xl">
        <div class="flex-1 h-12 border-2 border-stone-200 rounded-full bg-surface flex items-center px-4 gap-2.5 transition-colors focus-within:border-primary shadow-sm">
          <mat-icon class="text-stone-400 !text-xl">search</mat-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search groundnut, sesame, coconut, castor..."
            class="flex-1 border-0 bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
            (keyup.enter)="doSearch()"
          />
          @if (searchQuery) {
            <button class="bg-transparent border-0 text-stone-400 cursor-pointer flex items-center hover:text-stone-700" (click)="clearSearch()">
              <mat-icon class="!text-lg !w-4.5 !h-4.5">close</mat-icon>
            </button>
          }
        </div>
        <button mat-raised-button color="primary" class="!h-12 !px-7 !rounded-full !font-bold shrink-0" (click)="doSearch()">
          Search
        </button>
      </div>

      <!-- Results Grid -->
      @if (hasSearched()) {
        @if (searchResults().length > 0) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            @for (product of searchResults(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        } @else {
          <app-empty-state
            icon="search_off"
            title="No matching oils found"
            [description]="'We couldn\\'t find any oils matching \\'' + currentQuery() + '\\'. Try checking for typos or searching with broader keywords like groundnut, coconut, or sesame.'"
            actionText="Browse All Pure Oils"
            actionLink="/products"
          />
        }
      } @else {
        <div class="bg-surface border border-stone-200/80 rounded-xl p-5 sm:p-6 max-w-2xl shadow-sm">
          <h3 class="text-sm font-bold text-stone-900 mb-3">Popular Searches</h3>
          <div class="flex flex-wrap gap-2">
            @for (tag of popularTags; track tag) {
              <button
                class="px-3.5 py-2 rounded-full border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer transition-all hover:border-primary hover:text-primary hover:bg-amber-50"
                (click)="searchWithTag(tag)"
              >
                🔍 {{ tag }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ProductSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  searchQuery = '';
  readonly currentQuery = signal('');
  readonly hasSearched = signal(false);
  readonly searchResults = signal<Product[]>([]);

  readonly popularTags = [
    'Wood Pressed Groundnut Oil', 'Virgin Coconut Oil', 'Gingelly Sesame Oil', 'Pancha Deepa Lamp Oil', 'Neem Oil', 'Castor Oil', 'Oil Cake'
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] ?? '';
      this.searchQuery = q;
      this.currentQuery.set(q);
      if (q) {
        this.performSearch(q);
      }
    });
  }

  doSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.searchQuery.trim() },
        queryParamsHandling: 'merge'
      });
    }
  }

  searchWithTag(tag: string): void {
    this.searchQuery = tag;
    this.doSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentQuery.set('');
    this.hasSearched.set(false);
    this.searchResults.set([]);
  }

  private performSearch(query: string): void {
    this.hasSearched.set(true);
    this.productService.searchProducts(query).subscribe(results => {
      this.searchResults.set(results);
    });
  }
}
