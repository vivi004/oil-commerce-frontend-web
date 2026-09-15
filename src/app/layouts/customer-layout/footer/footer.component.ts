import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-[#0c0906] text-stone-300 border-t border-amber-950/80">
      
      <!-- Section 1: Pre-Footer Trust Bar -->
      <div class="border-b border-stone-800/80 bg-[#120e09]">
        <div class="page-container py-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            <!-- Item 1 -->
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-full bg-[#241707] border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0">
                ☀️
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-bold text-white m-0 leading-tight">100% Wood Pressed</h5>
                <p class="text-[11px] text-stone-400 m-0 mt-0.5">Vaagai wood churners &lt; 40°C</p>
              </div>
            </div>

            <!-- Item 2 -->
            <div class="flex items-center gap-3.5 lg:border-l lg:border-stone-800 lg:pl-6">
              <div class="w-10 h-10 rounded-full bg-[#0a2012] border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg shrink-0">
                🛡️
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-bold text-white m-0 leading-tight">NABL Lab Tested</h5>
                <p class="text-[11px] text-stone-400 m-0 mt-0.5">Zero mineral oil or chemicals</p>
              </div>
            </div>

            <!-- Item 3 -->
            <div class="flex items-center gap-3.5 lg:border-l lg:border-stone-800 lg:pl-6">
              <div class="w-10 h-10 rounded-full bg-[#241707] border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0">
                🚚
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-bold text-white m-0 leading-tight">Free Express Delivery</h5>
                <p class="text-[11px] text-stone-400 m-0 mt-0.5">On orders above ₹499 in TN</p>
              </div>
            </div>

            <!-- Item 4 -->
            <div class="flex items-center gap-3.5 lg:border-l lg:border-stone-800 lg:pl-6">
              <div class="w-10 h-10 rounded-full bg-[#0a2012] border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg shrink-0">
                ⚖️
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-bold text-white m-0 leading-tight">Farmer Direct Sourced</h5>
                <p class="text-[11px] text-stone-400 m-0 mt-0.5">Fair prices to Erode farmers</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Section 2: 4-Column Main Content -->
      <div class="page-container py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          <!-- Col 1: Brand & Contact Info (4.5 cols) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/40 shrink-0">
                <span class="text-2xl leading-none">🪔</span>
              </div>
              <div>
                <span class="font-['Outfit',sans-serif] text-2xl font-black text-white tracking-tight block">Nisha Pure Oils</span>
                <span class="text-[10.5px] font-bold tracking-wider uppercase text-amber-400 block">WOOD PRESSED &amp; AGRO INDUSTRIES</span>
              </div>
            </div>

            <p class="text-xs text-stone-300 leading-relaxed max-w-sm">
              Carrying forward three generations of traditional oil pressing heritage from Kangeyam &amp; Erode. Cold-extracted below 40°C in native Vaagai wood churners to preserve vital nutrients, natural aroma, and essential healthy fats.
            </p>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="inline-flex items-center gap-1 bg-[#0a2816] text-[#22c55e] border border-[#22c55e]/40 px-3 py-1 rounded-full text-[11px] font-bold">
                ✓ FSSAI Lic: 12423008000456
              </span>
              <span class="inline-flex items-center bg-[#2b1b04] text-amber-300 border border-amber-400/50 px-3 py-1 rounded-full text-[11px] font-bold">
                ISO 9001:2015 Certified
              </span>
            </div>

            <!-- Address & Helplines -->
            <div class="space-y-2 pt-2 text-xs text-stone-300">
              <div class="flex items-start gap-2.5">
                <span class="text-amber-400 text-sm mt-0.5">📍</span>
                <span>Nisha Agro Mill Complex, Kangeyam Road, Muthur, Erode, Tamil Nadu 638107</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-amber-400 text-sm">📞</span>
                <span class="font-bold text-white">+91 98421 88990</span>
                <span class="text-stone-500">|</span>
                <span class="text-stone-400 text-[11px]">Mon – Sat (8 AM – 8 PM)</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-amber-400 text-sm">✉️</span>
                <a href="mailto:care@nishapureoils.com" class="text-stone-300 hover:text-amber-300 transition-colors no-underline">
                  care&#64;nishapureoils.com
                </a>
              </div>
            </div>

            <!-- Social Media Rounded Circles -->
            <div class="flex items-center gap-2.5 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#1c160f] border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-all no-underline text-xs" title="Facebook">
                f
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#1c160f] border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-all no-underline text-xs" title="Instagram">
                📸
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#1c160f] border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-all no-underline text-xs" title="YouTube">
                ▶
              </a>
              <a href="https://wa.me/919842188990" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#1c160f] border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-all no-underline text-xs" title="WhatsApp">
                💬
              </a>
            </div>
          </div>

          <!-- Col 2: Our Products (2.5 cols) -->
          <div class="lg:col-span-3">
            <h4 class="font-['Outfit',sans-serif] text-base font-bold text-white mb-4">Our Products</h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-2.5 text-xs">
              <li>
                <a routerLink="/products" class="text-amber-400 font-semibold hover:underline flex items-center justify-between no-underline group">
                  <span>Cold-Pressed Oils</span>
                  <span class="text-stone-400 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'groundnut-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Groundnut Oil (Kadalai Ennai)</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'sesame-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Sesame / Gingelly (Nalla Ennai)</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'coconut-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Virgin Coconut (Thengai Ennai)</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'castor-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Cold-Pressed Castor Oil (Amanakku)</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'lamp-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Pancha Deepa Pooja Lamp Oil</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ category: 'mustard-oil' }" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Pure Mustard Oil (Kadugu Ennai)</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li class="pt-1">
                <a routerLink="/categories" class="text-amber-400 font-bold hover:underline no-underline inline-block text-xs">
                  View All Categories &rarr;
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 3: Quick Links (2.2 cols) -->
          <div class="lg:col-span-2">
            <h4 class="font-['Outfit',sans-serif] text-base font-bold text-white mb-4">Quick Links</h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-2.5 text-xs">
              <li>
                <a routerLink="/about" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>About Our Mill</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/brands" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Nisha &amp; Varshini Gold</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/about" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Extraction Process</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/reviews" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Verified Reviews</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/orders" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Track My Order</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Wholesale &amp; Export</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
              <li>
                <a routerLink="/support" class="text-stone-300 hover:text-amber-300 flex items-center justify-between no-underline group">
                  <span>Help &amp; Support</span>
                  <span class="text-stone-500 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 4: Direct Mill Newsletter (3.3 cols) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="font-['Outfit',sans-serif] text-base font-bold text-white mb-2 flex items-center gap-2">
              <span class="text-amber-400">✉️</span>
              <span>Direct Mill Newsletter</span>
            </h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              Get notified of fresh seasonal harvest batches, cold-pressing dates, and exclusive subscriber festival discounts.
            </p>

            <!-- Newsletter Input -->
            <div class="space-y-2">
              <div class="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  class="flex-1 bg-[#1a140d] border border-stone-800 rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-stone-500 focus:border-amber-500"
                  aria-label="Enter your email address"
                />
                <button
                  type="button"
                  class="bg-[#eab308] hover:bg-[#ca8a04] text-stone-950 font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 shrink-0"
                >
                  Join
                </button>
              </div>
              <span class="text-[11px] text-stone-400 block">🔒 Zero spam. Unsubscribe anytime.</span>
            </div>

            <!-- 15L Commercial Tins Box -->
            <div class="p-3.5 rounded-xl bg-[#1c160f] border border-amber-500/30">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-base">🛢️</span>
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">15L COMMERCIAL TINS &amp; BULK</span>
              </div>
              <p class="text-[11px] text-stone-300 leading-normal mb-2">
                Supplying hotels, caterers, sweet makers, and organic stores with mill-direct rates.
              </p>
              <a
                href="https://wa.me/919842188990?text=Hi%2C%20I%20am%20interested%20in%20Bulk%20Oil%20Ordering"
                target="_blank"
                rel="noopener"
                class="text-xs font-bold text-amber-300 hover:text-amber-200 no-underline inline-flex items-center gap-1"
              >
                <span>Inquire on WhatsApp Desk</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Section 3: Bottom Legal & Payment -->
      <div class="border-t border-stone-800/80 bg-black/60">
        <div class="page-container py-4">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
            
            <!-- Left: Copyright -->
            <div class="text-stone-300 text-center lg:text-left">
              &copy; {{ currentYear }} <strong class="text-white font-bold">Nisha Pure Oils &amp; Agro Industries</strong>. All Rights Reserved.
            </div>

            <!-- Middle: Policy Links in Gold -->
            <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-amber-400 text-xs font-medium">
              <a routerLink="/about" class="hover:underline text-amber-400 no-underline">Quality Standards</a>
              <span class="text-stone-600">|</span>
              <a routerLink="/contact" class="hover:underline text-amber-400 no-underline">Shipping Policy</a>
              <span class="text-stone-600">|</span>
              <a routerLink="/contact" class="hover:underline text-amber-400 no-underline">Refunds</a>
              <span class="text-stone-600">|</span>
              <a routerLink="/contact" class="hover:underline text-amber-400 no-underline">Privacy</a>
              <span class="text-stone-600">|</span>
              <a routerLink="/contact" class="hover:underline text-amber-400 no-underline">Terms</a>
            </div>

            <!-- Right: 100% SAFE Badges in Gold -->
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10.5px] uppercase font-bold tracking-wider text-amber-400 mr-1">100% SAFE:</span>
              <span class="px-2 py-0.5 rounded bg-[#1c160f] border border-amber-500/40 text-[11px] font-semibold text-amber-300">UPI</span>
              <span class="px-2 py-0.5 rounded bg-[#1c160f] border border-amber-500/40 text-[11px] font-semibold text-amber-300">GPay</span>
              <span class="px-2 py-0.5 rounded bg-[#1c160f] border border-amber-500/40 text-[11px] font-semibold text-amber-300">Cards</span>
              <span class="px-2 py-0.5 rounded bg-[#1c160f] border border-amber-500/40 text-[11px] font-semibold text-amber-300">COD</span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  `,
  styles: [],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
