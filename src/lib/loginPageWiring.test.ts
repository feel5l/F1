import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Login.tsx wiring (auth merge regressions)', () => {
  const login = readFileSync(resolve(__dirname, '../pages/Login.tsx'), 'utf8');

  it('uses normalizeSchoolEmail for email login and password reset', () => {
    expect(login).toMatch(/normalizeSchoolEmail/);
    expect(login).toMatch(/signInWithEmailAndPassword\(auth, loginIdentifier/);
    expect(login).toMatch(/sendPasswordResetEmail\(auth, fullEmail\)/);
    expect(login).toMatch(/canRequestPasswordReset/);
  });

  it('uses shouldFallbackToGoogleRedirect for popup → redirect fallback', () => {
    expect(login).toMatch(/shouldFallbackToGoogleRedirect/);
    expect(login).toMatch(/signInWithRedirect/);
  });
});

/** Merged PR #2: form/dialog submit bugs and username-style reset identifiers. */
describe('Login.tsx wiring (PR #2 login-information merge)', () => {
  const login = readFileSync(resolve(__dirname, '../pages/Login.tsx'), 'utf8');

  it('completes Google redirect sign-in via getRedirectResult on mount', () => {
    expect(login).toMatch(/getRedirectResult\(auth\)/);
    expect(login).toMatch(/useEffect\(/);
  });

  it('uses type="button" on password-reset dialog controls inside the login form', () => {
    const dialogTriggerButton = login.match(
      /DialogTrigger[\s\S]*?type="button"[\s\S]*?نسيت كلمة المرور/
    );
    expect(dialogTriggerButton).not.toBeNull();
    expect(login).toMatch(
      /DialogFooter[\s\S]*?type="button"[\s\S]*?إلغاء[\s\S]*?type="button"[\s\S]*?handleResetPassword/
    );
  });

  it('accepts username-only reset identifiers (text input, not type="email")', () => {
    expect(login).toMatch(/id="resetEmail"/);
    expect(login).toMatch(/type="text"/);
    expect(login).toMatch(/zayd12345 أو example@ghiabi\.com/);
    expect(login).toMatch(/اسم المستخدم أو البريد الإلكتروني/);
  });
});