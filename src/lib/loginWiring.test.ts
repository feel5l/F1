import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const loginSource = readFileSync(path.join(__dirname, '../pages/Login.tsx'), 'utf8');

describe('Login wiring regressions', () => {
  it('normalizes identifiers via shared schoolEmail helper', () => {
    expect(loginSource).toContain('normalizeSchoolEmail');
    expect(loginSource).not.toMatch(/normalizedEmail\.includes\('@'\)/);
  });

  it('falls back to Google redirect when popup is blocked', () => {
    expect(loginSource).toContain('shouldFallbackToGoogleRedirect');
    expect(loginSource).toContain('signInWithRedirect');
  });
});