import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state, isLoading: true, error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, isLoading: false, error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state, isLoading: true, error: null,
  })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, isLoading: false, error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
  })),

  // Logout
  on(AuthActions.logout, () => initialAuthState),
  on(AuthActions.logoutSuccess, () => initialAuthState),

  // Profile
  on(AuthActions.loadProfile, (state) => ({
    ...state, isLoading: true,
  })),
  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, isLoading: false,
  })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
  })),
  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state, user,
  })),

  // Token refresh
  on(AuthActions.refreshTokenSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true,
  })),
  on(AuthActions.refreshTokenFailure, () => initialAuthState),
);
