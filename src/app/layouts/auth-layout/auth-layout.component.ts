import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, MatProgressBarModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#1c150c] via-[#3d2209] to-[#78350f] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.25)_0%,transparent_70%)] -top-24 -right-24 pointer-events-none"></div>
      <div class="absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(254,240,138,0.15)_0%,transparent_70%)] -bottom-36 -left-24 pointer-events-none"></div>

      <!-- Logo -->
      <div class="mb-6 sm:mb-8 z-10">
        <a routerLink="/home" class="flex items-center gap-2.5 no-underline">
          <span class="text-3xl">🪔</span>
          <span class="font-['Outfit',sans-serif] text-2xl sm:text-[28px] font-bold text-white tracking-tight">Nisha Pure Oils</span>
        </a>
      </div>

      <!-- Card -->
      <main class="w-full max-w-[460px] z-10">
        <div class="bg-white/95 rounded-2xl sm:rounded-[20px] p-5 sm:p-10 shadow-2xl backdrop-blur-xl border border-white/10">
          <router-outlet />
        </div>

        <p class="text-center mt-5 text-white/40 text-[13px]">
          © {{ currentYear }} Nisha Pure Oils & Agro Industries. All rights reserved.
        </p>
      </main>
    </div>
  `,
  styles: [],
})
export class AuthLayoutComponent {
  readonly currentYear = new Date().getFullYear();
}
