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

  it('opens and dismisses reset dialog without submitting the login form', () => {
    expect(smoke).toMatch(/get_by_role\("button", name="نسيت كلمة المرور\؟"\)/);
    expect(smoke).toMatch(/get_by_role\("button", name="إلغاء"\)/);
    expect(smoke).not.toMatch(/تسجيل الدخول"\)\.click/);
  });
});

describe('Login.tsx selectors required by e2e/smoke_test.py', () => {
  const login = readFileSync(resolve(__dirname, '../pages/Login.tsx'), 'utf8');

  it('exposes stable element ids and button labels probed by Playwright', () => {
    expect(login).toMatch(/id="email"/);
    expect(login).toMatch(/id="password"/);
    expect(login).toMatch(/id="resetEmail"/);
    expect(login).toMatch(/غيابي - Ghiyabi/);
    expect(login).toMatch(/الدخول السريع عبر حساب جوجل/);
    expect(login).toMatch(/تسجيل الدخول/);
    expect(login).toMatch(/نسيت كلمة المرور/);
    expect(login).toMatch(/إلغاء/);
  });

  it('keeps username-or-email login affordances from merged auth UX changes', () => {
    expect(login).toMatch(/اسم المستخدم أو البريد الإلكتروني/);
    expect(login).toMatch(/placeholder="zayd12345"/);
    expect(login).toMatch(/placeholder="zayd12345 أو example@ghiabi\.com"/);
  });
});