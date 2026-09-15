import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="text-center py-12 px-6 sm:py-16 sm:px-8 bg-white border border-stone-200/90 rounded-3xl max-w-lg mx-auto shadow-xs my-6">
      <div class="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-5 shadow-xs">
        @if (emoji()) {
          <span class="text-4xl leading-none">{{ emoji() }}</span>
        } @else {
          <mat-icon class="!text-4xl !w-10 !h-10 text-amber-700">{{ icon() }}</mat-icon>
        }
      </div>
      <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-2">{{ title() }}</h3>
      <p class="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto">{{ description() }}</p>
      @if (actionText()) {
        @if (actionLink()) {
          <a mat-raised-button color="primary" [routerLink]="actionLink()" class="!rounded-full !px-7 !h-11 !font-bold shadow-xs">
            {{ actionText() }}
          </a>
        } @else {
          <button mat-raised-button color="primary" (click)="actionClick.emit()" class="!rounded-full !px-7 !h-11 !font-bold shadow-xs">
            {{ actionText() }}
          </button>
        }
      }
    </div>
  `,
  styles: [],
})
export class EmptyStateComponent {
  readonly icon = input<string>('inbox');
  readonly emoji = input<string | null>(null);
  readonly title = input<string>('No items found');
  readonly description = input<string>('There are currently no items to display in this view.');
  readonly actionText = input<string | null>(null);
  readonly actionLink = input<string | null>(null);
  readonly actionClick = output<void>();
}
