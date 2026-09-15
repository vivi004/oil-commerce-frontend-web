import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[var(--color-bg)]">
      <!-- Hero Header -->
      <section class="bg-gradient-to-br from-[#180e06] via-[#3a1a06] to-[#692907] text-white py-16 sm:py-24 px-4">
        <div class="page-container text-center">
          <span class="inline-block text-xs font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase backdrop-blur-md">
            OUR HERITAGE &amp; MISSION
          </span>
          <h1 class="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight text-white" style="color: #ffffff !important;">
            Preserving Ancient Oil Wisdom for Modern Living
          </h1>
          <p class="text-sm sm:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Rooted in Kangeyam, the traditional oil capital of Tamil Nadu, Nisha Pure Oils was established with a singular mission: to deliver 100% natural, unadulterated cold-pressed oils from our wood churners straight to your kitchen.
          </p>
        </div>
      </section>

      <!-- Story & Philosophy -->
      <section class="section-padding">
        <div class="page-container">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <!-- Left: Image with floating badge -->
            <div class="lg:col-span-6 relative">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80"
                alt="Traditional wood pressing"
                class="w-full h-64 sm:h-96 md:h-[480px] object-cover rounded-3xl shadow-xl"
              />
              <div class="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-amber-700 text-white p-5 sm:px-7 sm:py-5 rounded-2xl shadow-2xl flex flex-col items-center text-center border-2 border-amber-400/30">
                <span class="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold leading-none">30+</span>
                <span class="text-xs font-bold opacity-90 mt-1 uppercase tracking-wider">Years of Agro Excellence</span>
              </div>
            </div>

            <!-- Right: Text Story -->
            <div class="lg:col-span-6">
              <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1.5">Why Wood Churning (Marachekku)?</span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mb-4 leading-tight">
                True Cold Pressing Below 40°C
              </h2>
              <p class="text-sm sm:text-base text-stone-600 leading-relaxed mb-4">
                Conventional high-speed steel expellers generate friction temperatures exceeding 85°C to 120°C, scorching natural proteins, stripping Vitamin E, and producing volatile oxidized free radicals.
              </p>
              <p class="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
                At <strong>Nisha Pure Oils</strong>, we utilize heavy pestles sculpted from mature <strong>Vaagai trees</strong> (Albizia lebbeck). The wood naturally absorbs excess heat, keeping the crushing cycle strictly below 40°C. This time-honored mechanical method yields pure, unrefined, raw virgin oil that retains its natural golden hue, heavenly nutty fragrance, and vital nutrients.
              </p>

              <!-- Metrics -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-200/80 pt-6">
                <div class="flex flex-col bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
                  <strong class="font-['Outfit',sans-serif] text-2xl font-extrabold text-amber-700">0%</strong>
                  <span class="text-xs text-stone-500 font-medium">Hexane Solvents</span>
                </div>
                <div class="flex flex-col bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
                  <strong class="font-['Outfit',sans-serif] text-2xl font-extrabold text-amber-700">100%</strong>
                  <span class="text-xs text-stone-500 font-medium">Sun-Dried Seeds</span>
                </div>
                <div class="flex flex-col col-span-2 sm:col-span-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
                  <strong class="font-['Outfit',sans-serif] text-xs font-bold text-amber-700">12423008000456</strong>
                  <span class="text-xs text-stone-500 font-medium">FSSAI License</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dual Brand Vision -->
      <section class="section-padding bg-stone-50 border-y border-stone-200/80">
        <div class="page-container">
          <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Our Portfolio</span>
            <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">Two Trusted Brands, One Quality Standard</h2>
            <p class="text-sm sm:text-base text-stone-500 mt-1">Meeting both traditional cold-pressed and modern high-heat culinary needs</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Brand 1: Nisha Pure Oils -->
            <div class="rounded-3xl p-6 sm:p-9 border border-amber-300/80 bg-amber-50 shadow-xs flex flex-col justify-between">
              <div>
                <div class="text-[11px] font-extrabold bg-amber-900 text-amber-100 px-3 py-1 rounded-full inline-block self-start mb-4 uppercase tracking-wider">HERITAGE MARACHEKKU</div>
                <h3 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-amber-950 mb-2">Nisha Pure Oils</h3>
                <p class="text-stone-700 text-sm mb-6 leading-relaxed flex-1">
                  Dedicated exclusively to wood-churned virgin groundnut, coconut, and sesame oils, plus sacred Pancha Deepa lamp oils, organic neem, mahua, peanut burfi, and organic cattle feed oil cakes.
                </p>
                <ul class="space-y-2.5 text-sm text-stone-800 mb-8 list-none p-0 font-medium">
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Raw, virgin, and completely unbleached</li>
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Traditional Karupatti (Palm Jaggery) sesame blend</li>
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Rich in natural antioxidants and cellular nutrients</li>
                </ul>
              </div>
              <div>
                <a mat-raised-button color="primary" routerLink="/products" [queryParams]="{ brand: 'Nisha Pure Oils' }" class="!h-12 !px-7 !rounded-full !font-bold shadow-xs">
                  Shop Nisha Pure Oils
                </a>
              </div>
            </div>

            <!-- Brand 2: Varshini Gold -->
            <div class="rounded-3xl p-6 sm:p-9 border border-amber-300/80 bg-gradient-to-br from-amber-50 via-[#fffdf9] to-amber-100/70 shadow-xs flex flex-col justify-between">
              <div>
                <div class="text-[11px] font-extrabold bg-amber-800 text-amber-100 px-3 py-1 rounded-full inline-block self-start mb-4 uppercase tracking-wider">CULINARY EXCELLENCE</div>
                <h3 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-amber-950 mb-2">Varshini Gold</h3>
                <p class="text-stone-700 text-sm mb-6 leading-relaxed flex-1">
                  Formulated for everyday crisp frying, family cooking, and commercial bakeries with high smoke points, balanced aroma, and zero trans-fat refined cooking oils.
                </p>
                <ul class="space-y-2.5 text-sm text-stone-800 mb-8 list-none p-0 font-medium">
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Superior thermal resistance for deep frying</li>
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Multi-stage micro-filtration with low oil retention</li>
                  <li class="flex items-center gap-2"><mat-icon class="text-amber-800 !text-base !w-4 !h-4">check_circle</mat-icon> Economic 1L pouches, 5L cans, and 15L commercial tins</li>
                </ul>
              </div>
              <div>
                <a mat-raised-button color="accent" routerLink="/products" [queryParams]="{ brand: 'Varshini Gold' }" class="!h-12 !px-7 !rounded-full !font-bold shadow-xs">
                  Shop Varshini Gold
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Farmer Partnerships -->
      <section class="section-padding">
        <div class="page-container">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Ethical Direct Sourcing</span>
            <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">Empowering Over 1,200 Local Farmers</h2>
            <p class="text-sm sm:text-base text-stone-600 leading-relaxed mb-8">
              We work directly with agricultural cooperatives and independent farmers across Kangeyam, Pollachi, Tiruppur, and Dharapuram. By offering fair, stable procurement prices and skipping middlemen, we ensure farmers receive legitimate rewards for high-grade non-GMO crops.
            </p>
            <div class="flex justify-center gap-4 flex-wrap">
              <a mat-raised-button color="primary" routerLink="/products" class="!h-12 !px-8 !rounded-full !font-bold shadow-xs">
                Explore Our Range
              </a>
              <a mat-stroked-button routerLink="/contact" class="!h-12 !px-8 !rounded-full !font-bold">
                Contact Mill Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class AboutComponent {}
