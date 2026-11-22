import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: logout must clear Firebase session and return to login route. */
describe('Layout.tsx logout wiring', () => {
  const source = readFileSync(resolve(__dirname, '../components/Layout.tsx'), 'utf8');

  it('signs out via shared auth client then navigates to /login', () => {
    expect(source).toMatch(/auth\.signOut\(\)/);
    expect(source).toMatch(/navigate\('\/login'\)/);
    const signOutBeforeNavigate =
      source.indexOf('signOut') < source.indexOf("navigate('/login')");
    expect(signOutBeforeNavigate).toBe(true);
  });

  it('binds logout handler to the visible control', () => {
    expect(source).toMatch(/handleLogout/);
    expect(source).toMatch(/onClick=\{handleLogout\}/);
  });
});