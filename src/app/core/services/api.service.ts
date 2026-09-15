import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] | number | boolean };
  responseType?: 'json';
  withCredentials?: boolean;
  context?: HttpContext;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── GET ──────────────────────────────────────────────────────────────────────

  get<T>(endpoint: string, options?: RequestOptions): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(endpoint), options)
      .pipe(catchError(this.handleError));
  }

  getPaginated<T>(
    endpoint: string,
    params?: { [key: string]: string | number | boolean },
  ): Observable<ApiResponse<PaginatedResponse<T>>> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<ApiResponse<PaginatedResponse<T>>>(this.buildUrl(endpoint), { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  // ── POST ─────────────────────────────────────────────────────────────────────

  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(endpoint), body, options)
      .pipe(catchError(this.handleError));
  }

  // ── PUT ──────────────────────────────────────────────────────────────────────

  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(this.buildUrl(endpoint), body, options)
      .pipe(catchError(this.handleError));
  }

  // ── PATCH ────────────────────────────────────────────────────────────────────

  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<ApiResponse<T>> {
    return this.http
      .patch<ApiResponse<T>>(this.buildUrl(endpoint), body, options)
      .pipe(catchError(this.handleError));
  }

  // ── DELETE ───────────────────────────────────────────────────────────────────

  delete<T>(endpoint: string, options?: RequestOptions): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(this.buildUrl(endpoint), options)
      .pipe(catchError(this.handleError));
  }

  // ── File Upload ───────────────────────────────────────────────────────────────

  upload<T>(endpoint: string, formData: FormData): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(endpoint), formData)
      .pipe(catchError(this.handleError));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private buildParams(
    params?: { [key: string]: string | number | boolean },
  ): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
