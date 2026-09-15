import { createAction, props } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest } from '../../models/user.model';

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = createAction(
  '[Auth] Login',
  props<{ request: LoginRequest }>(),
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>(),
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// ── Register ──────────────────────────────────────────────────────────────────
export const register = createAction(
  '[Auth] Register',
  props<{ request: RegisterRequest }>(),
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User }>(),
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// ── Profile ───────────────────────────────────────────────────────────────────
export const loadProfile = createAction('[Auth] Load Profile');
export const loadProfileSuccess = createAction(
  '[Auth] Load Profile Success',
  props<{ user: User }>(),
);
export const loadProfileFailure = createAction(
  '[Auth] Load Profile Failure',
  props<{ error: string }>(),
);
export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>(),
);

// ── Token ─────────────────────────────────────────────────────────────────────
export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ user: User }>(),
);
export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
);

// ── Init ──────────────────────────────────────────────────────────────────────
export const initAuth = createAction('[Auth] Init');
