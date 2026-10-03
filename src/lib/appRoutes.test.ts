import { describe, it, expect } from 'vitest';
import { ROUTE_ACCESS } from './routeAccess';

/** Paths guarded by ProtectedRoute in App.tsx — must stay in sync with ROUTE_ACCESS. */
const APP_PROTECTED_PATHS = [
  '/',
  '/students',
  '/staff',
  '/classes',
  '/attendance',
  '/logs',
  '/reports',
] as const;

describe('ROUTE_ACCESS parity with App.tsx', () => {
  it('defines non-empty role lists for every protected route', () => {
    for (const path of APP_PROTECTED_PATHS) {
      expect(ROUTE_ACCESS[path], `missing ROUTE_ACCESS for ${path}`).toBeDefined();
      expect(ROUTE_ACCESS[path].length).toBeGreaterThan(0);
    }
  });

  it('does not drift from the set of protected application routes', () => {
    expect(Object.keys(ROUTE_ACCESS).sort()).toEqual([...APP_PROTECTED_PATHS].sort());
  });
});
