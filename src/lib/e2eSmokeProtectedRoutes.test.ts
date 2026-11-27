import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { SMOKE_PROTECTED_ROUTES } from './smokeProtectedRoutes';

describe('e2e smoke protected routes (merged PR #3)', () => {
  const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');
  const smoke = readFileSync(resolve(__dirname, '../../e2e/smoke_test.py'), 'utf8');

  it('registers every smoke route as an authenticated App route', () => {
    for (const route of SMOKE_PROTECTED_ROUTES) {
      const segment = route.slice(1);
      expect(app).toMatch(new RegExp(`path="/${segment}"`));
    }
  });

  it('keeps smoke_test.py in sync with canonical protected route list', () => {
    for (const route of SMOKE_PROTECTED_ROUTES) {
      expect(smoke).toContain(`"${route}"`);
    }
  });
});