import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Auth Guard — protects routes that require authentication.
 * Redirects unauthenticated users to /auth/login.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const tokenService = inject(TokenService);
  const router       = inject(Router);

  if (tokenService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([APP_CONSTANTS.ROUTES.LOGIN], {
    queryParams: { returnUrl: window.location.pathname },
  });
};
