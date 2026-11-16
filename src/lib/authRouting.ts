/**
 * Client-side auth routing decisions (App.tsx + e2e/smoke_test.py unauthenticated redirects).
 */

/** Routes verified by Playwright smoke test to require login when unauthenticated. */
export const SMOKE_PROTECTED_PATHS = [
  '/',
  '/attendance',
  '/students',
  '/classes',
  '/staff',
  '/logs',
  '/reports',
] as const;

/** Deep-link routes probed by e2e/smoke_test.py (unauthenticated must land on /login). */
export const SMOKE_E2E_GOTO_ROUTES = [
  '/attendance',
  '/students',
  '/classes',
  '/staff',
  '/logs',
  '/reports',
] as const;

export type AuthRouteDecision =
  | 'loading'
  | 'show-login'
  | 'redirect-to-home'
  | 'redirect-to-login'
  | 'show-app';

function isLoginPath(pathname: string): boolean {
  return pathname === '/login' || pathname.startsWith('/login/');
}

/**
 * Pure routing outcome for a pathname and auth session (mirrors App route guards).
 */
export function resolveAuthRoute(
  pathname: string,
  hasUser: boolean,
  authLoading: boolean
): AuthRouteDecision {
  if (authLoading) return 'loading';
  if (isLoginPath(pathname)) {
    return hasUser ? 'redirect-to-home' : 'show-login';
  }
  return hasUser ? 'show-app' : 'redirect-to-login';
}

/** Whether an unauthenticated visitor must be sent to /login (smoke-test contract). */
export function mustRedirectUnauthenticatedToLogin(pathname: string): boolean {
  if (isLoginPath(pathname)) return false;
  return true;
}