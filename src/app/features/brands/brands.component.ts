import { Component, signal, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-brands',
  imports: [MatButtonModule, MatIconModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-[var(--color-bg)]">
      <!-- Hero Header -->
      <section class="bg-gradient-to-br from-[#180f07] via-[#351a08] to-[#5e2807] text-white py-14 sm:py-20 px-4">
        <div class="max-w-7xl mx-auto text-center px-4">
          <span class="inline-block text-xs font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 rounded-full mb-3.5 tracking-wider uppercase backdrop-blur-md">
            Our Brand Portfolio
          </span>
          <h1 class="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight text-white" style="color: #ffffff !important;">
            Trusted Oil Brands for Every Kitchen
          </h1>
          <p class="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            From traditional Vaagai wood cold-pressed virgin oils to everyday culinary cooking oils, our Kangeyam mills ensure 100% purity, unmatched aroma, and wholesome health.
          </p>
        </div>
      </section>

      <!-- Brand Selector Tabs -->
      <section class="bg-white/95 backdrop-blur-md border-b border-stone-200 py-3.5 sm:py-4 px-4 sticky top-20 z-10 shadow-xs">
        <div class="max-w-7xl mx-auto flex justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            class="px-5 py-2 rounded-full border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
            [class.bg-amber-700]="selectedBrand() === 'ALL'"
            [class.text-white]="selectedBrand() === 'ALL'"
            [class.border-amber-700]="selectedBrand() === 'ALL'"
            [class.shadow-sm]="selectedBrand() === 'ALL'"
            [class.border-stone-200]="selectedBrand() !== 'ALL'"
            [class.bg-stone-50]="selectedBrand() !== 'ALL'"
            [class.text-stone-700]="selectedBrand() !== 'ALL'"
            (click)="selectBrand('ALL')"
          >
            All Products ({{ allProducts().length }})
          </button>
          <button
            class="px-5 py-2 rounded-full border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
            [class.bg-amber-700]="selectedBrand() === 'Nisha Pure Oils'"
            [class.text-white]="selectedBrand() === 'Nisha Pure Oils'"
            [class.border-amber-700]="selectedBrand() === 'Nisha Pure Oils'"
            [class.shadow-sm]="selectedBrand() === 'Nisha Pure Oils'"
            [class.border-stone-200]="selectedBrand() !== 'Nisha Pure Oils'"
            [class.bg-stone-50]="selectedBrand() !== 'Nisha Pure Oils'"
            [class.text-stone-700]="selectedBrand() !== 'Nisha Pure Oils'"
            (click)="selectBrand('Nisha Pure Oils')"
          >
            🌿 Nisha Pure Oils
          </button>
          <button
            class="px-5 py-2 rounded-full border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
            [class.bg-amber-700]="selectedBrand() === 'Varshini Gold'"
            [class.text-white]="selectedBrand() === 'Varshini Gold'"
            [class.border-amber-700]="selectedBrand() === 'Varshini Gold'"
            [class.shadow-sm]="selectedBrand() === 'Varshini Gold'"
            [class.border-stone-200]="selectedBrand() !== 'Varshini Gold'"
            [class.bg-stone-50]="selectedBrand() !== 'Varshini Gold'"
            [class.text-stone-700]="selectedBrand() !== 'Varshini Gold'"
            (click)="selectBrand('Varshini Gold')"
          >
            ⭐ Varshini Gold
          </button>
          <button
            class="px-5 py-2 rounded-full border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
            [class.bg-amber-700]="selectedBrand() === 'Roshini Gold'"
            [class.text-white]="selectedBrand() === 'Roshini Gold'"
            [class.border-amber-700]="selectedBrand() === 'Roshini Gold'"
            [class.shadow-sm]="selectedBrand() === 'Roshini Gold'"
            [class.border-stone-200]="selectedBrand() !== 'Roshini Gold'"
            [class.bg-stone-50]="selectedBrand() !== 'Roshini Gold'"
            [class.text-stone-700]="selectedBrand() !== 'Roshini Gold'"
            (click)="selectBrand('Roshini Gold')"
          >
            🌻 Roshini Gold
          </button>
          <button
            class="px-5 py-2 rounded-full border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
            [class.bg-amber-700]="selectedBrand() === 'Rosi Gold'"
            [class.text-white]="selectedBrand() === 'Rosi Gold'"
            [class.border-amber-700]="selectedBrand() === 'Rosi Gold'"
            [class.shadow-sm]="selectedBrand() === 'Rosi Gold'"
            [class.border-stone-200]="selectedBrand() !== 'Rosi Gold'"
            [class.bg-stone-50]="selectedBrand() !== 'Rosi Gold'"
            [class.text-stone-700]="selectedBrand() !== 'Rosi Gold'"
            (click)="selectBrand('Rosi Gold')"
          >
            🌴 Rosi Gold
          </button>
        </div>
      </section>

      <!-- Brand Spotlight Banner -->
      <section class="pt-8 pb-4">
        <div class="page-container">
          @if (selectedBrand() === 'Nisha Pure Oils') {
            <div class="rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-[#1c1006] to-[#3b1d09] text-white shadow-xl border border-amber-900/40 mb-8 animate-fade-in">
              <span class="text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full inline-block mb-3.5 uppercase tracking-wider">
                Heritage Cold Pressed
              </span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold mb-2" style="color: #ffffff !important;">Nisha Pure Oils</h2>
              <p class="text-stone-300 text-sm leading-relaxed mb-5 max-w-3xl">
                100% Vaagai wood pressed below 40°C. Raw virgin groundnut, cold-pressed coconut, traditional gingelly with palm jaggery, pure castor, neem seed, mahua, and sacred Pancha Deepam lamp oil.
              </p>
              <div class="flex gap-4 text-xs font-bold text-amber-300 flex-wrap">
                <span>✓ 100% Raw Virgin Cold Pressed</span>
                <span>✓ Zero Solvents &amp; Bleaching</span>
                <span>✓ NABL Tested Purity</span>
              </div>
            </div>
          }

          @if (selectedBrand() === 'Varshini Gold') {
            <div class="rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-amber-50 via-[#fffdf9] to-amber-100 border border-amber-300/80 text-stone-900 shadow-md mb-8 animate-fade-in">
              <span class="text-[11px] font-extrabold bg-amber-800 text-amber-100 px-3.5 py-1 rounded-full inline-block mb-3.5 uppercase tracking-wider">
                Culinary Excellence
              </span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-950 mb-2">Varshini Gold</h2>
              <p class="text-stone-700 text-sm leading-relaxed mb-5 max-w-3xl">
                High-performance culinary multi-seed blended edible cooking oil formulated for high heat stability, crisp frying, low oil absorption, and everyday wholesome family cooking.
              </p>
              <div class="flex gap-4 text-xs font-bold text-amber-900 flex-wrap">
                <span>✓ High Smoke Point</span>
                <span>✓ Ultra-Crisp Non-Greasy Frying</span>
                <span>✓ Traditional Multi-Seed Blend</span>
              </div>
            </div>
          }

          @if (selectedBrand() === 'Roshini Gold') {
            <div class="rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-yellow-50 via-[#fffef5] to-amber-100 border border-yellow-300/80 text-stone-900 shadow-md mb-8 animate-fade-in">
              <span class="text-[11px] font-extrabold bg-yellow-800 text-yellow-100 px-3.5 py-1 rounded-full inline-block mb-3.5 uppercase tracking-wider">
                Refined Sunflower Line
              </span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">Roshini Gold</h2>
              <p class="text-stone-700 text-sm leading-relaxed mb-5 max-w-3xl">
                Pure refined sunflower oil rich in Vitamin E with high smoke point for effortless deep frying, curries, and light everyday cooking.
              </p>
              <div class="flex gap-4 text-xs font-bold text-amber-900 flex-wrap">
                <span>✓ Rich in Natural Vitamin E</span>
                <span>✓ High Smoke Point for Sauté &amp; Frying</span>
                <span>✓ Light &amp; Digestible</span>
              </div>
            </div>
          }

          @if (selectedBrand() === 'Rosi Gold') {
            <div class="rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-orange-50 via-[#fffaf5] to-amber-100 border border-orange-300/80 text-stone-900 shadow-md mb-8 animate-fade-in">
              <span class="text-[11px] font-extrabold bg-orange-800 text-orange-100 px-3.5 py-1 rounded-full inline-block mb-3.5 uppercase tracking-wider">
                Culinary Palm Olein
              </span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">Rosi Gold</h2>
              <p class="text-stone-700 text-sm leading-relaxed mb-5 max-w-3xl">
                Natural refined culinary palm olein oil ideal for high-temperature commercial and household cooking, snacks preparation, and traditional delicacies.
              </p>
              <div class="flex gap-4 text-xs font-bold text-orange-950 flex-wrap">
                <span>✓ High Heat Stability</span>
                <span>✓ Wholesome Frying Value</span>
                <span>✓ 100% Vegetable Source</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Products Grid -->
      <section class="pb-20">
        <div class="page-container">
          <div class="mb-6 flex justify-between items-center">
            <div>
              <h2 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-extrabold text-stone-900 m-0">
                {{ selectedBrand() === 'ALL' ? 'All Brand Products' : selectedBrand() + ' Collection' }}
              </h2>
              <p class="text-xs sm:text-sm text-stone-500 mt-1">Showing {{ filteredProducts().length }} available products</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class BrandsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly allProducts = signal<Product[]>([]);
  readonly selectedBrand = signal<string>('ALL');
  readonly filteredProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 50 }).subscribe((res) => {
      this.allProducts.set(res.items);
      this.filteredProducts.set(res.items);
    });
  }

  selectBrand(brand: string): void {
    this.selectedBrand.set(brand);
    if (brand === 'ALL') {
      this.filteredProducts.set(this.allProducts());
    } else {
      this.filteredProducts.set(
        this.allProducts().filter((p) => p.brand?.toLowerCase() === brand.toLowerCase()),
      );
    }
  }
}
