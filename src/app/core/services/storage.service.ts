import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'shopzone_';

  // ── Local Storage ────────────────────────────────────────────────────────────

  setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error('StorageService.setLocal error:', e);
    }
  }

  getLocal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }

  removeLocal(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clearLocal(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(this.prefix))
      .forEach((k) => localStorage.removeItem(k));
  }

  // ── Session Storage ───────────────────────────────────────────────────────────

  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error('StorageService.setSession error:', e);
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  clearSession(): void {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(this.prefix))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  // ── Raw (no prefix) for external tokens ──────────────────────────────────────

  setRaw(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getRaw(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeRaw(key: string): void {
    localStorage.removeItem(key);
  }
}
