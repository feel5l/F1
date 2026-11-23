import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: Login.tsx must keep using extracted auth helpers (Google + school email). */
describe('Login.tsx auth wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Login.tsx'), 'utf8');

  it('delegates Google popup fallback and credential normalization to lib helpers', () => {
    expect(source).toMatch(/shouldFallbackToGoogleRedirect/);
    expect(source).toMatch(/normalizeSchoolEmail/);
    expect(source).toMatch(/resolvePasswordResetEmail/);
    expect(source).not.toMatch(/auth\/popup-blocked/);
    expect(source).not.toMatch(/@ghiabi\.com`/);
  });

  it('handles Google redirect completion on mount', () => {
    expect(source).toMatch(/getRedirectResult/);
  });

  it('falls back to Google redirect when popup sign-in is blocked', () => {
    expect(source).toMatch(/signInWithPopup/);
    expect(source).toMatch(/shouldFallbackToGoogleRedirect/);
    expect(source).toMatch(/signInWithRedirect/);
  });

  it('keeps password-reset controls out of the login form submit path (merged PR #2)', () => {
    expect(source).toMatch(/const handleResetPassword = async/);
    expect(source).toMatch(/resolvePasswordResetEmail\(resetEmail\)/);
    expect(source).toMatch(/sendPasswordResetEmail\(auth, fullEmail\)/);
    const buttonTypeCount = source.match(/type="button"/g)?.length ?? 0;
    expect(buttonTypeCount).toBeGreaterThanOrEqual(3);
    expect(source).not.toMatch(/onClick=\{handleResetPassword\}[^>]*type="submit"/);
  });
});