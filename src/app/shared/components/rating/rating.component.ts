import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIconModule],
  template: `
    <div class="inline-flex items-center gap-1 text-[13px]">
      <div class="inline-flex items-center text-amber-400">
        @for (star of [1, 2, 3, 4, 5]; track star) {
          <mat-icon
            class="!text-base !w-4 !h-4 !leading-none select-none transition-transform"
            [class.cursor-pointer]="interactive()"
            [class.hover:scale-125]="interactive()"
            (click)="onStarClick(star)"
          >
            {{ getStarIcon(star) }}
          </mat-icon>
        }
      </div>
      @if (showValue()) {
        <span class="font-bold text-stone-900 ml-0.5">{{ value().toFixed(1) }}</span>
      }
      @if (reviewCount() !== undefined) {
        <span class="text-stone-400 text-xs">({{ reviewCount() }})</span>
      }
    </div>
  `,
  styles: [],
})
export class RatingComponent {
  readonly value = input<number>(0);
  readonly reviewCount = input<number | undefined>(undefined);
  readonly showValue = input<boolean>(true);
  readonly interactive = input<boolean>(false);
  readonly ratingChange = output<number>();

  isFilled(star: number): boolean {
    return this.value() >= star;
  }

  isHalf(star: number): boolean {
    return this.value() >= star - 0.5 && this.value() < star;
  }

  getStarIcon(star: number): string {
    if (this.value() >= star) return 'star';
    if (this.value() >= star - 0.5) return 'star_half';
    return 'star_border';
  }

  onStarClick(star: number): void {
    if (this.interactive()) {
      this.ratingChange.emit(star);
    }
  }
}
