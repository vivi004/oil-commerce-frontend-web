import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatChipsModule, FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-[var(--color-bg)]">

      <!-- ===== 1. HERO BANNER ===== -->
      <section class="relative bg-gradient-to-br from-[#140e08] via-[#241306] to-[#451e07] min-h-[85vh] flex items-center overflow-hidden py-12 md:py-20">
        <!-- Ambient radial glow decorations -->
        <div class="absolute -top-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-amber-600/10 blur-3xl pointer-events-none"></div>

        <div class="page-container relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            <!-- Left 7 cols: Brand Copy & CTAs -->
            <div class="lg:col-span-7 flex flex-col items-start">
              <!-- Eyebrow Pill Badge -->
              <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/25 rounded-full text-amber-300 text-xs sm:text-[13px] font-bold mb-6 tracking-wide backdrop-blur-md">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                100% Traditional Vaagai Wood Cold-Pressed (Marachekku)
              </div>

              <!-- Main Heading -->
              <h1 class="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold leading-[1.15] mb-5 tracking-tight text-white" style="color: #ffffff !important;">
                Pure Traditional Oils,<br />
                <span class="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Pure Health for Family.
                </span>
              </h1>

              <!-- Subtitle -->
              <p class="text-sm sm:text-base text-stone-300 leading-relaxed mb-8 max-w-xl">
                Cold-pressed below 40°C in traditional Vaagai wood churners to lock in natural aroma,
                rich nutrients, and healthy antioxidants. 0% chemicals, no solvents, pure unadulterated goodness.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 w-full sm:w-auto">
                <a
                  mat-raised-button
                  color="primary"
                  routerLink="/products"
                  class="!h-13 !px-8 !rounded-full !text-[15px] !font-bold !shadow-lg !shadow-amber-950/50 flex items-center justify-center gap-2"
                >
                  <mat-icon class="!text-[20px] !w-5 !h-5">shopping_bag</mat-icon>
                  <span>Shop All Oils</span>
                </a>
                <a
                  mat-stroked-button
                  routerLink="/brands"
                  class="!h-13 !px-7 !rounded-full !text-[15px] !font-semibold !text-amber-300 !border-amber-400/40 hover:!bg-amber-400/10 flex items-center justify-center transition-all"
                >
                  <span>Our Brands (Nisha &amp; Varshini) →</span>
                </a>
              </div>

              <!-- Key Statistics Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10 w-full">
                @for (stat of stats; track stat.label) {
                  <div>
                    <div class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-300 leading-none mb-1">{{ stat.value }}</div>
                    <div class="text-[11px] text-stone-400 font-bold uppercase tracking-wider">{{ stat.label }}</div>
                  </div>
                }
              </div>
            </div>

            <!-- Right 5 cols: Featured Product Card -->
            <div class="lg:col-span-5 flex justify-center lg:justify-center">
              <div class="w-full max-w-[305px] sm:max-w-[320px] bg-stone-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-amber-400/30">
                <div class="relative">
                  <img
                    src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=720&auto=format&fit=crop&q=85"
                    alt="Nisha Pure Wood Cold Pressed Groundnut Oil"
                    class="w-full h-52 object-cover"
                  />
                  <div class="absolute top-3.5 left-3.5">
                    <span class="text-[10.5px] font-extrabold bg-amber-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Fresh Batch
                    </span>
                  </div>
                  <div class="absolute top-3.5 right-3.5">
                    <span class="text-[10.5px] font-bold bg-black/75 text-amber-300 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/15">
                      Kangeyam Mill
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <span class="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block mb-1">Heritage Collection</span>
                  <h3 class="text-[17px] font-bold text-white mb-1 leading-snug" style="color: #ffffff !important;">Wood Pressed Groundnut Oil</h3>
                  <p class="text-xs text-stone-400 mb-4 leading-relaxed">Vaagai Marachekku · 100% Raw Virgin · 500ml–15L</p>

                  <div class="flex items-center justify-between mb-4 pt-3 border-t border-white/10">
                    <div>
                      <span class="text-2xl font-extrabold text-amber-300">₹290</span>
                      <span class="text-xs text-stone-400 ml-1.5 line-through">₹340</span>
                    </div>
                    <span class="text-xs text-emerald-400 font-extrabold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      15% OFF
                    </span>
                  </div>

                  <a
                    mat-raised-button
                    color="primary"
                    routerLink="/products/prod-groundnut-nisha"
                    class="w-full !h-11 !rounded-xl !font-bold !text-[13.5px] flex items-center justify-center shadow-md"
                  >
                    View Product &amp; Sizes →
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ===== 2. TRUST BAR ===== -->
      <section class="bg-amber-950 text-amber-200 py-4 border-b border-amber-900/60 hidden md:block">
        <div class="page-container">
          <div class="flex items-center justify-between gap-6 text-[13.5px] font-semibold overflow-x-auto">
            @for (trust of trustBadges; track trust.label) {
              <div class="flex items-center gap-2.5 shrink-0">
                <span class="text-lg leading-none">{{ trust.icon }}</span>
                <span>{{ trust.label }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===== 3. CATEGORIES SECTION ===== -->
      <section class="section-padding">
        <div class="page-container">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Categories</span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Explore Our Oils &amp; Agro Range</h2>
            </div>
            <a
              mat-stroked-button
              routerLink="/categories"
              class="!rounded-full !px-6 !text-[13.5px] !font-bold !text-amber-800 !border-stone-300 self-start sm:self-auto hover:!border-amber-700 hover:!bg-amber-50"
            >
              All Categories →
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            @for (cat of categories(); track cat.slug) {
              <a
                [routerLink]="['/products']"
                [queryParams]="{ category: cat.slug }"
                class="group bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center no-underline transition-all duration-300 hover:border-amber-600 hover:shadow-lg hover:-translate-y-1.5"
              >
                <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:bg-amber-100 group-hover:scale-110 transition-all">
                  {{ cat.icon }}
                </div>
                <h3 class="text-[14px] sm:text-[15px] font-bold text-stone-900 m-0 leading-tight group-hover:text-amber-800 transition-colors">{{ cat.name }}</h3>
                <span class="text-xs text-stone-400 mt-1.5 font-medium">{{ cat.productCount }} items</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- ===== 4. FEATURED PRODUCTS ===== -->
      <section class="section-padding bg-stone-50 border-y border-stone-200/80">
        <div class="page-container">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Cold-Pressed Favorites</span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Featured Pure Oils</h2>
            </div>
            <a
              mat-stroked-button
              routerLink="/products"
              class="!rounded-full !px-6 !text-[13.5px] !font-bold !text-amber-800 !border-stone-300 self-start sm:self-auto hover:!border-amber-700 hover:!bg-amber-50"
            >
              Browse All Products →
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>

      <!-- ===== 5. BRAND SHOWCASE (NISHA & VARSHINI) ===== -->
      <section class="section-padding">
        <div class="page-container">
          <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Two Trusted Mill Brands</span>
            <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Heritage Cold Pressed &amp; Culinary Oils</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Brand 1: Nisha Pure Oils -->
            <div class="bg-gradient-to-br from-[#1a0f06] to-[#3a1d09] rounded-3xl p-6 sm:p-9 text-white flex flex-col justify-between shadow-xl border border-amber-900/40">
              <div>
                <span class="text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-4">
                  Flagship Brand
                </span>
                <h3 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold mb-2" style="color: #ffffff !important;">
                  Nisha Pure Oils
                </h3>
                <p class="text-amber-200/90 text-xs sm:text-sm font-semibold mb-3">100% Vaagai Wood Cold-Pressed (Marachekku)</p>
                <p class="text-stone-300 text-xs sm:text-[14px] leading-relaxed mb-6">
                  Extracted at slow speeds below 40°C in solid Vaagai wood pestles. Retains full aroma, natural golden color, and vital nutrients.
                </p>

                <div class="space-y-2.5 mb-8">
                  @for (feat of nishaFeatures; track feat) {
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                      <mat-icon class="!text-base !w-4 !h-4 text-emerald-400">check_circle</mat-icon>
                      <span>{{ feat }}</span>
                    </div>
                  }
                </div>
              </div>

              <a
                mat-raised-button
                color="primary"
                routerLink="/products"
                [queryParams]="{ brand: 'Nisha Pure Oils' }"
                class="!h-12 !px-7 !rounded-full !font-bold !text-[14px] self-start shadow-md"
              >
                Explore Nisha Pure Oils →
              </a>
            </div>

            <!-- Brand 2: Varshini Gold -->
            <div class="bg-gradient-to-br from-amber-50 via-[#fffdfa] to-amber-100/70 border border-amber-300/80 rounded-3xl p-6 sm:p-9 text-stone-900 flex flex-col justify-between shadow-md">
              <div>
                <span class="text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full bg-amber-800 text-amber-100 inline-block mb-4">
                  Culinary Brand
                </span>
                <h3 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-950 mb-2">
                  Varshini Gold
                </h3>
                <p class="text-amber-800 text-xs sm:text-sm font-semibold mb-3">High Smoke Point · Crispy &amp; Non-Greasy Cooking</p>
                <p class="text-stone-700 text-xs sm:text-[14px] leading-relaxed mb-6">
                  Refined and filtered for daily Indian cooking and high-heat frying. Ensures crispy dosas, puffed puris, and lightweight texture.
                </p>

                <div class="space-y-2.5 mb-8">
                  @for (feat of varshiniFeatures; track feat) {
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                      <mat-icon class="!text-base !w-4 !h-4 text-amber-700">check_circle</mat-icon>
                      <span>{{ feat }}</span>
                    </div>
                  }
                </div>
              </div>

              <a
                mat-raised-button
                routerLink="/products"
                [queryParams]="{ brand: 'Varshini Gold' }"
                class="!h-12 !px-7 !rounded-full !font-bold !text-[14px] !bg-amber-800 !text-white self-start shadow-md"
              >
                Explore Varshini Gold →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 6. WHY CHOOSE US ===== -->
      <section class="section-padding bg-stone-50 border-y border-stone-200/80">
        <div class="page-container">
          <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Quality Guarantee</span>
            <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Why 50,000+ Families Choose Us</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            @for (feature of whyUs; track feature.title) {
              <div class="bg-white border border-stone-200/80 rounded-2xl p-6 flex flex-col items-start shadow-xs hover:shadow-md hover:-translate-y-1 transition-all">
                <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mb-4 text-amber-800">
                  {{ feature.icon }}
                </div>
                <h3 class="text-[16px] font-bold text-stone-900 mb-2">{{ feature.title }}</h3>
                <p class="text-xs sm:text-[13px] text-stone-500 leading-relaxed m-0">{{ feature.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===== 7. MILL FACTORY OUTLET & BULK DESK ===== -->
      <section class="section-padding bg-[#120e09] text-white">
        <div class="page-container">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Mill info (7 cols) -->
            <div class="lg:col-span-7">
              <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-2">KANGEYAM MILL OUTLET</span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style="color: #ffffff !important;">
                Visit Our Mill or Order Direct
              </h2>
              <p class="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-6 max-w-lg">
                Experience authentic wood extraction live at our Kangeyam facility. We fulfill individual household orders, 15L commercial tins, and direct bulk supply across India.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                <div class="bg-[#1c160f] border border-stone-800/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 text-sm">
                    📍
                  </div>
                  <div>
                    <span class="text-xs text-amber-300 font-bold block mb-0.5">Mill Address</span>
                    <span class="text-xs text-stone-300 leading-snug block">Kangeyam Road, Erode District, TN 638107</span>
                  </div>
                </div>
                <div class="bg-[#1c160f] border border-stone-800/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 text-sm">
                    📞
                  </div>
                  <div>
                    <span class="text-xs text-amber-300 font-bold block mb-0.5">Helpline &amp; WhatsApp</span>
                    <span class="text-xs text-stone-300 leading-snug block">+91 98421 88990 / +91 98765 43210</span>
                  </div>
                </div>
              </div>

              <div class="flex gap-3.5 flex-wrap items-center">
                <a
                  href="https://wa.me/919842188990?text=Hello%20Nisha%20Pure%20Oils"
                  target="_blank"
                  class="h-11 px-6 rounded-full font-bold text-xs sm:text-sm bg-white text-stone-950 hover:bg-stone-100 flex items-center gap-2 shadow-lg transition-all no-underline"
                >
                  <span class="text-base">💬</span>
                  <span>WhatsApp Direct Order</span>
                </a>
                <a
                  routerLink="/contact"
                  class="h-11 px-6 rounded-full font-bold text-xs sm:text-sm bg-transparent text-amber-300 border border-amber-500/60 hover:bg-amber-500/10 flex items-center gap-1.5 transition-all no-underline"
                >
                  <span>Wholesale Inquiries →</span>
                </a>
              </div>
            </div>

            <!-- Wholesale box (5 cols) -->
            <div class="lg:col-span-5 bg-white text-stone-900 rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div class="flex items-center gap-3.5 mb-3.5">
                <div class="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shrink-0">
                  🏬
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-stone-900 m-0 leading-tight">Bulk &amp; Commercial Supply</h3>
                  <span class="text-xs text-stone-500 font-medium">15L Food Grade Tins &amp; Agro Oil Cake</span>
                </div>
              </div>
              <p class="text-xs text-stone-600 mb-4 leading-relaxed">
                Special wholesale pricing for restaurants, catering services, temples, and dealer distributors.
              </p>
              <div class="p-3.5 bg-[#fbf6ea] rounded-2xl border border-amber-200/90 mb-5 flex items-start gap-2.5">
                <span class="text-base leading-none mt-0.5">🌾</span>
                <div>
                  <div class="text-xs font-bold text-amber-950">Groundnut &amp; Sesame Pinnakku</div>
                  <div class="text-[11px] text-amber-800/90 mt-0.5 leading-snug">Direct mill truck loads available for dairy and cattle farms.</div>
                </div>
              </div>
              <a
                routerLink="/contact"
                class="w-full h-11 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#8c4307] hover:bg-[#78350f] flex items-center justify-center gap-1.5 shadow-md transition-all no-underline"
              >
                <span>Contact Mill Sales Desk</span>
                <span>&gt;</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly featuredProducts = signal<Product[]>([]);
  readonly bestSellers = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);

  readonly stats = [
    { value: '100%', label: 'Vaagai Wood Churned' },
    { value: '50K+', label: 'Happy Families' },
    { value: '0%', label: 'Chemicals / Solvents' },
    { value: '4.9★', label: 'Purity Rating' },
  ];

  readonly trustBadges = [
    { icon: '🌿', label: 'Below 40°C Cold Press' },
    { icon: '🧪', label: 'NABL Lab Certified' },
    { icon: '🚫', label: 'Zero Hexane Solvents' },
    { icon: '🌾', label: 'Direct Farmer Sourced' },
    { icon: '🚚', label: 'Free Delivery Above ₹499' },
  ];

  readonly nishaFeatures = [
    'Traditional Vaagai wood churned',
    'Cold pressed below 40°C',
    'Zero chemical solvents or argemone',
    'Tamper-proof virgin food-safe bottles',
  ];

  readonly varshiniFeatures = [
    'Triple-filtered for high smoke points',
    'Low oil absorption for crispy cooking',
    'Ideal for puris, dosas, and daily frying',
    'Available in pouches, bottles, and 15L tins',
  ];

  readonly whyUs = [
    {
      icon: '🪵',
      title: 'Vaagai Wood Churned',
      desc: 'Slow mechanical pressing retains natural aroma, vital enzymes, and authentic taste.',
    },
    {
      icon: '🚫',
      title: 'Zero Hexane Solvents',
      desc: 'No chemical processing, no bleaching, and no mineral oil adulteration.',
    },
    {
      icon: '📜',
      title: 'FSSAI & Lab Tested',
      desc: 'Every batch tested in accredited laboratories for 100% food purity standards.',
    },
    {
      icon: '🚚',
      title: 'Direct Doorstep Delivery',
      desc: 'Safely packed in leak-proof protective corrugated cartons across India.',
    },
  ];

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.featuredProducts.set(products.slice(0, 4));
    });

    this.productService.getBestSellers().subscribe((products) => {
      this.bestSellers.set(products.slice(0, 4));
    });

    this.productService.getCategories().subscribe((cats) => {
      this.categories.set(cats.slice(0, 5));
    });
  }
}
