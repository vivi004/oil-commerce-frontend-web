import { Component, input, output, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (totalPages() > 1) {
      <div class="flex items-center justify-center gap-2 mt-10">
        <button
          mat-icon-button
          [disabled]="page() <= 1"
          (click)="onPageClick(page() - 1)"
          aria-label="Previous page"
          class="!w-10 !h-10 !rounded-xl !border !border-stone-200 hover:!bg-amber-50"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <div class="flex items-center gap-2">
          @for (p of pagesList(); track p) {
            <button
              class="w-10 h-10 rounded-xl border border-stone-200 bg-white text-stone-800 font-bold text-[13.5px] cursor-pointer flex items-center justify-center transition-all hover:border-amber-700 hover:text-amber-800 shadow-xs"
              [class.!bg-amber-700]="p === page()"
              [class.!text-white]="p === page()"
              [class.!border-amber-700]="p === page()"
              [class.shadow-md]="p === page()"
              (click)="onPageClick(p)"
            >
              {{ p }}
            </button>
          }
        </div>

        <button
          mat-icon-button
          [disabled]="page() >= totalPages()"
          (click)="onPageClick(page() + 1)"
          aria-label="Next page"
          class="!w-10 !h-10 !rounded-xl !border !border-stone-200 hover:!bg-amber-50"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    }
  `,
  styles: [],
})
export class PaginationComponent {
  readonly page = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly pageChange = output<number>();

  readonly pagesList = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  });

  onPageClick(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages() && newPage !== this.page()) {
      this.pageChange.emit(newPage);
    }
  }
}
