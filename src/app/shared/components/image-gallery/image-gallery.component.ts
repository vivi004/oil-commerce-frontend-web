import { Component, input, signal } from '@angular/core';
import { ProductImage } from '../../../core/models/product.model';

@Component({
  selector: 'app-image-gallery',
  template: `
    <div class="flex flex-col gap-4">
      <!-- Main Active Preview -->
      <div class="w-full h-80 sm:h-[440px] rounded-2xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center">
        <img [src]="currentImageUrl()" [alt]="altText()" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>

      <!-- Thumbnails -->
      @if (images().length > 1) {
        <div class="flex gap-3 overflow-x-auto pb-1">
          @for (img of images(); track img.id; let i = $index) {
            <button
              class="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 border-transparent p-0 bg-white cursor-pointer shrink-0 transition-all hover:opacity-90"
              [class.!border-amber-700]="selectedIdx() === i"
              [class.shadow-[0_0_0_2px_rgba(180,83,9,0.2)]]="selectedIdx() === i"
              (click)="selectedIdx.set(i)"
            >
              <img [src]="img.url" [alt]="img.altText ?? altText()" class="w-full h-full object-cover" />
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ImageGalleryComponent {
  readonly images = input<ProductImage[]>([]);
  readonly altText = input<string>('Product image');
  readonly selectedIdx = signal(0);

  currentImageUrl(): string {
    const list = this.images();
    if (!list || list.length === 0) return '';
    const idx = Math.min(this.selectedIdx(), list.length - 1);
    return list[idx]?.url ?? list[0].url;
  }
}
