/** Routes checked by e2e/smoke_test.py for unauthenticated redirect (PR #3). */
export const SMOKE_PROTECTED_ROUTES = [
  '/attendance',
  '/students',
  '/classes',
  '/staff',
  '/logs',
  '/reports',
] as const;