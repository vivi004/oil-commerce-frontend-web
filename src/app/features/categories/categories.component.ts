import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/product.model';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container section-padding">
      <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span class="inline-block text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full mb-2">PRODUCT CATEGORIES</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0 mb-3">Traditional Oils &amp; Agro Categories</h1>
        <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
          Explore our complete range of authentic cold-pressed edible oils, therapeutic herbal extracts, sacred pooja oils, and traditional sweets.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        @for (cat of categories(); track cat.slug) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ category: cat.slug }"
            class="group flex flex-col items-center text-center p-5 sm:p-7 bg-white border border-stone-200/90 rounded-2xl no-underline transition-all duration-300 hover:border-amber-600 hover:shadow-xl hover:-translate-y-1.5"
          >
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:bg-amber-100 group-hover:scale-110 transition-all">
              {{ cat.icon }}
            </div>
            <h3 class="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-stone-900 m-0 mb-2 leading-tight group-hover:text-amber-800 transition-colors">{{ cat.name }}</h3>
            <p class="hidden sm:block text-xs text-stone-500 leading-relaxed m-0 mb-4 flex-1">{{ cat.description }}</p>
            <span class="text-xs sm:text-[13px] font-bold text-amber-800 group-hover:text-amber-950 transition-colors">Browse Oils →</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class CategoriesComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.productService.getCategories().subscribe((cats) => {
      this.categories.set(cats);
    });
  }
}
