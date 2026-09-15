import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import * as AuthActions from './auth.actions';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  // ── Init: restore session from localStorage ───────────────────────────────
  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      map(() => {
        const user = this.tokenService.getUser();
        if (user && !this.tokenService.isTokenExpired()) {
          return AuthActions.loadProfileSuccess({ user });
        }
        return AuthActions.logoutSuccess();
      }),
    ),
  );

  // ── Load Profile ─────────────────────────────────────────────────────────
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      exhaustMap(() =>
        this.authService.getProfile().pipe(
          map((user) => AuthActions.loadProfileSuccess({ user })),
          catchError((err) =>
            of(AuthActions.loadProfileFailure({ error: err?.error?.message ?? 'Failed to load profile' })),
          ),
        ),
      ),
    ),
  );

  // ── Logout ────────────────────────────────────────────────────────────────
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.tokenService.clearTokens();
          this.router.navigateByUrl(APP_CONSTANTS.ROUTES.LOGIN);
        }),
      ),
    { dispatch: false },
  );

  // ── Login Success ─────────────────────────────────────────────────────────
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.toastr.success('Welcome back!', 'Login Successful');
          this.router.navigateByUrl(APP_CONSTANTS.ROUTES.HOME);
        }),
      ),
    { dispatch: false },
  );

  // ── Register Success ──────────────────────────────────────────────────────
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.toastr.success('Account created successfully!', 'Welcome!');
          this.router.navigateByUrl(APP_CONSTANTS.ROUTES.HOME);
        }),
      ),
    { dispatch: false },
  );

  // ── Auth Errors ───────────────────────────────────────────────────────────
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => this.toastr.error(error, 'Login Failed')),
      ),
    { dispatch: false },
  );

  registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerFailure),
        tap(({ error }) => this.toastr.error(error, 'Registration Failed')),
      ),
    { dispatch: false },
  );
}

