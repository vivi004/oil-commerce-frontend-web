import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * JWT Interceptor — attaches Bearer token to every outgoing request
 * except login, register, and refresh endpoints.
 */
export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const tokenService = inject(TokenService);

  // Skip auth endpoints
  const skipUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password'];
  const shouldSkip = skipUrls.some((url) => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  const token = tokenService.getAccessToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': req.headers.has('Content-Type')
          ? req.headers.get('Content-Type')!
          : 'application/json',
        'Accept': 'application/json',
      },
    });
    return next(authReq);
  }

  return next(req);
};
