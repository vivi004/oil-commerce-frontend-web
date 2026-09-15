import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import * as AuthActions from './core/state/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  template: `
    <router-outlet />
    <ngx-spinner
      bdColor="rgba(15, 15, 26, 0.75)"
      size="medium"
      color="#7e57c2"
      type="ball-scale-multiple"
      [fullScreen]="true"
    >
      <p class="text-white text-sm mt-4 font-medium">Loading...</p>
    </ngx-spinner>
  `,
  styles: [],
})
export class App implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    // Restore auth state from localStorage on app bootstrap
    this.store.dispatch(AuthActions.initAuth());
  }
}
