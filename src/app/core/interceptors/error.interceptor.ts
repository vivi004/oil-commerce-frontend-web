import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { APP_CONSTANTS } from '../constants/app.constants';

let isRefreshing = false;

/**
 * Error Interceptor — handles HTTP errors globally:
 * - 401: attempt token refresh, then logout
 * - 403: forbidden redirect
 * - 404: not found toast
 * - 422: validation error display
 * - 500: server error toast
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const router      = inject(Router);
  const toastr      = inject(ToastrService);
  const authService = inject(AuthService);
  const tokenService= inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error?.error?.message ?? 'An unexpected error occurred';

      switch (error.status) {
        case 401: {
          if (!isRefreshing && !req.url.includes('/auth/')) {
            isRefreshing = true;
            return authService.refreshToken().pipe(
              switchMap(() => {
                isRefreshing = false;
                const token = tokenService.getAccessToken();
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` },
                });
                return next(retryReq);
              }),
              catchError(() => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => error);
              }),
            );
          }
          authService.logout();
          break;
        }
        case 403:
          toastr.error('You do not have permission to perform this action.', 'Forbidden');
          router.navigate([APP_CONSTANTS.ROUTES.HOME]);
          break;
        case 404:
          // Let components handle 404s individually
          break;
        case 422:
          // Validation errors — let forms handle field-level errors
          break;
        case 500:
        case 502:
        case 503:
          toastr.error('Server error. Please try again later.', 'Service Unavailable');
          break;
        case 0:
          // Backend server is offline or unreachable - log warning silently so mock data fallbacks take over seamlessly
          console.warn('[HTTP Interceptor] Backend server unreachable at port 8080. Operating in offline/mock fallback mode.');
          break;
        default:
          if (error.status >= 400) {
            toastr.error(message, 'Error');
          }
      }

      return throwError(() => error);
    }),
  );
};
