import { Injectable, signal, computed } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly jwtHelper = new JwtHelperService();

  // Signals for reactive token state
  private readonly _accessToken = signal<string | null>(this.loadStoredToken());
  private readonly _user        = signal<User | null>(this.loadStoredUser());

  readonly accessToken  = this._accessToken.asReadonly();
  readonly currentUser  = this._user.asReadonly();
  readonly isLoggedIn   = computed(() => !!this._accessToken() && !this.isTokenExpired());

  constructor(private storage: StorageService) {}

  // ── Token Management ─────────────────────────────────────────────────────────

  setTokens(accessToken: string, refreshToken: string): void {
    this.storage.setRaw(environment.jwtTokenKey, accessToken);
    this.storage.setRaw(environment.jwtRefreshKey, refreshToken);
    this._accessToken.set(accessToken);
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  getRefreshToken(): string | null {
    return this.storage.getRaw(environment.jwtRefreshKey);
  }

  clearTokens(): void {
    this.storage.removeRaw(environment.jwtTokenKey);
    this.storage.removeRaw(environment.jwtRefreshKey);
    this._accessToken.set(null);
    this._user.set(null);
  }

  // ── User Management ───────────────────────────────────────────────────────────

  setUser(user: User): void {
    this.storage.setLocal(environment.userKey, user);
    this._user.set(user);
  }

  getUser(): User | null {
    return this._user();
  }

  // ── JWT Utilities ─────────────────────────────────────────────────────────────

  isTokenExpired(): boolean {
    const token = this._accessToken();
    if (!token) return true;
    try {
      return this.jwtHelper.isTokenExpired(token, 60);
    } catch {
      return true;
    }
  }

  getTokenPayload<T>(): T | null {
    const token = this._accessToken();
    if (!token) return null;
    try {
      return this.jwtHelper.decodeToken<T>(token);
    } catch {
      return null;
    }
  }

  getTokenExpiry(): Date | null {
    const token = this._accessToken();
    if (!token) return null;
    try {
      return this.jwtHelper.getTokenExpirationDate(token);
    } catch {
      return null;
    }
  }

  // ── Private Helpers ───────────────────────────────────────────────────────────

  private loadStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(environment.jwtTokenKey);
  }

  private loadStoredUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('shopzone_' + environment.userKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
