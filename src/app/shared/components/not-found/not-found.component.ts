import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-6 sm:p-10">
      <div class="text-center max-w-[480px]">
        <div class="relative mb-8">
          <span class="font-['Outfit',sans-serif] text-8xl sm:text-[120px] font-extrabold text-stone-200 leading-none block select-none">404</span>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl">🔍</div>
        </div>
        <h1 class="text-2xl sm:text-[32px] font-bold text-stone-900 mb-3">Page Not Found</h1>
        <p class="text-stone-600 mb-8 text-sm sm:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a mat-raised-button color="primary" routerLink="/home" id="go-home">
            <mat-icon>home</mat-icon> Go Home
          </a>
          <a mat-stroked-button routerLink="/products">Browse Products</a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class NotFoundComponent {}
