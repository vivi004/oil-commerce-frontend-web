import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserRole } from '../enums/user-role.enum';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Role Guard — protects routes requiring specific user roles.
 * Usage in route config: canActivate: [roleGuard], data: { roles: [UserRole.ADMIN] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const tokenService  = inject(TokenService);
  const router        = inject(Router);
  const requiredRoles = route.data['roles'] as UserRole[];
  const user          = tokenService.getUser();

  if (!user || !tokenService.isLoggedIn()) {
    return router.createUrlTree([APP_CONSTANTS.ROUTES.LOGIN]);
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (requiredRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree([APP_CONSTANTS.ROUTES.HOME]);
};
