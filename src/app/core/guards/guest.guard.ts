import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Guest Guard — prevents authenticated users from accessing auth pages
 * (login, register, forgot-password). Redirects to home.
 */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const tokenService = inject(TokenService);
  const router       = inject(Router);

  if (!tokenService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([APP_CONSTANTS.ROUTES.HOME]);
};
