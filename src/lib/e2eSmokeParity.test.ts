import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  SMOKE_PROTECTED_PATHS,
  mustRedirectUnauthenticatedToLogin,
} from './authRouting';

function extractSmokeLoopRoutes(smokeSource: string): string[] {
  const match = smokeSource.match(/for route in \[([^\]]+)\]/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe('e2e/smoke_test.py auth redirect contract', () => {
  const smoke = readFileSync(resolve(__dirname, '../../e2e/smoke_test.py'), 'utf8');
  const loopRoutes = extractSmokeLoopRoutes(smoke);

  it('keeps Playwright loop routes in sync with SMOKE_PROTECTED_PATHS', () => {
    const fromConstant = SMOKE_PROTECTED_PATHS.filter((p) => p !== '/');
    expect([...loopRoutes].sort()).toEqual([...fromConstant].sort());
  });

  it('verifies unauthenticated root redirect (smoke opens / before the loop)', () => {
    expect(smoke).toMatch(/page\.goto\(f"\{base_url\}\/"/);
    expect(mustRedirectUnauthenticatedToLogin('/')).toBe(true);
  });

  it('covers password-reset UI probed by smoke (resetEmail field)', () => {
    expect(smoke).toMatch(/#resetEmail/);
    expect(smoke).toMatch(/نسيت كلمة المرور/);
  });
});