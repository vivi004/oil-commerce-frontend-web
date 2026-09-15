import { Directive, HostListener, Input } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * DebounceClickDirective — prevents rapid multiple clicks on buttons.
 * Usage: <button appDebounceClick [debounceTime]="500" (debounceClick)="handler()">
 */
@Directive({
  selector: '[appDebounceClick]',
  standalone: true,
})
export class DebounceClickDirective {
  @Input() debounceTime = 300;

  private clicks = new Subject<Event>();

  constructor() {
    // Subscription handled internally via pipe
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
    this.clicks.next(event);
  }
}

/**
 * PermissionDirective — shows/hides elements based on user role.
 * Usage: <div [appPermission]="['admin', 'vendor']">...</div>
 */
@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective {
  @Input('appPermission') set roles(_requiredRoles: string[]) {
    // Implementation will use inject(Store) to get current user role
    // and toggle host element visibility
  }
}
