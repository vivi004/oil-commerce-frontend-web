import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div
      class="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm transition-all duration-200"
      [class.!bg-white/85]="glass()"
      [class.backdrop-blur-md]="glass()"
      [class.hover:shadow-md]="hoverable()"
      [class.hover:-translate-y-0.5]="hoverable()"
    >
      @if (title()) {
        <div class="mb-4 pb-3 border-b border-stone-200">
          <h3 class="text-lg font-bold text-stone-900 m-0">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-[13px] text-stone-400 mt-1">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="w-full">
        <ng-content />
      </div>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly glass = input<boolean>(false);
  readonly hoverable = input<boolean>(false);
}
