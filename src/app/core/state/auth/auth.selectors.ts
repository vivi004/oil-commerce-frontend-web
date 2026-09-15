import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser     = createSelector(selectAuthState, (s) => s.user);
export const selectIsAuthenticated = createSelector(selectAuthState, (s) => s.isAuthenticated);
export const selectAuthLoading     = createSelector(selectAuthState, (s) => s.isLoading);
export const selectAuthError       = createSelector(selectAuthState, (s) => s.error);

export const selectUserFullName = createSelector(selectCurrentUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : '',
);

export const selectUserInitials = createSelector(selectCurrentUser, (user) => {
  if (!user) return '';
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
});

export const selectUserRole = createSelector(selectCurrentUser, (user) => user?.role);

export const selectUserAvatar = createSelector(selectCurrentUser, (user) => user?.avatar);
