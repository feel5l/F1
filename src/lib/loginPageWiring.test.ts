import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Login.tsx wiring (auth merge regressions)', () => {
  const login = readFileSync(resolve(__dirname, '../pages/Login.tsx'), 'utf8');

  it('uses normalizeSchoolEmail for email login and password reset', () => {
    expect(login).toMatch(/normalizeSchoolEmail/);
    expect(login).toMatch(/signInWithEmailAndPassword\(auth, loginIdentifier/);
    expect(login).toMatch(/sendPasswordResetEmail\(auth, fullEmail\)/);
  });

  it('uses shouldFallbackToGoogleRedirect for popup → redirect fallback', () => {
    expect(login).toMatch(/shouldFallbackToGoogleRedirect/);
    expect(login).toMatch(/signInWithRedirect/);
  });
});