import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      mat-raised-button
      [color]="color()"
      [disabled]="disabled() || loading()"
      (click)="onClick($event)"
      class="!rounded-full !font-semibold tracking-wide !h-[42px] !px-6 relative"
    >
      @if (loading()) {
        <span class="w-4 h-4 border-2 border-current border-r-transparent rounded-full inline-block animate-spin mr-2"></span>
      } @else if (icon()) {
        <mat-icon class="!text-lg !w-[18px] !h-[18px] mr-1.5 align-middle">{{ icon() }}</mat-icon>
      }
      <ng-content />
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly icon = input<string | null>(null);
  readonly btnClick = output<MouseEvent>();

  onClick(e: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit(e);
    }
  }
}
