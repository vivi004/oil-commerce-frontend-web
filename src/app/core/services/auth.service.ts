import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { APP_CONSTANTS } from '../constants/app.constants';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from '../models/user.model';
import * as AuthActions from '../state/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api          = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router       = inject(Router);
  private readonly store        = inject(Store);
  private readonly toastr       = inject(ToastrService);

  // Reactive signals forwarded from TokenService
  readonly currentUser  = this.tokenService.currentUser;
  readonly isLoggedIn   = this.tokenService.isLoggedIn;
  readonly accessToken  = this.tokenService.accessToken;

  // Derived signals
  readonly userFullName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  // ── Authentication ────────────────────────────────────────────────────────────

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, request).pipe(
      map((res) => res.data),
      tap((data) => {
        this.tokenService.setTokens(data.accessToken, data.refreshToken);
        this.tokenService.setUser(data.user);
        this.store.dispatch(AuthActions.loginSuccess({ user: data.user }));
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, request).pipe(
      map((res) => res.data),
      tap((data) => {
        this.tokenService.setTokens(data.accessToken, data.refreshToken);
        this.tokenService.setUser(data.user);
        this.store.dispatch(AuthActions.loginSuccess({ user: data.user }));
      }),
    );
  }

  logout(): void {
    this.api.post(API_ENDPOINTS.AUTH.LOGOUT, {}).subscribe({
      complete: () => this.clearAuthState(),
      error: () => this.clearAuthState(),
    });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.api
      .post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
      .pipe(
        map((res) => res.data),
        tap((data) => {
          this.tokenService.setTokens(data.accessToken, data.refreshToken);
        }),
      );
  }

  // ── Password Management ───────────────────────────────────────────────────────

  forgotPassword(request: ForgotPasswordRequest): Observable<{ token?: string; resetUrl?: string } | null> {
    return this.api
      .post<{ token?: string; resetUrl?: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request)
      .pipe(map((res) => res.data ?? null));
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.api
      .post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.api
      .post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  // ── Profile ───────────────────────────────────────────────────────────────────

  getProfile(): Observable<User> {
    return this.api.get<User>(API_ENDPOINTS.AUTH.ME).pipe(
      map((res) => res.data),
      tap((user) => {
        this.tokenService.setUser(user);
        this.store.dispatch(AuthActions.loadProfileSuccess({ user }));
      }),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  private clearAuthState(): void {
    this.tokenService.clearTokens();
    this.store.dispatch(AuthActions.logout());
    this.router.navigateByUrl(APP_CONSTANTS.ROUTES.LOGIN);
  }
}
