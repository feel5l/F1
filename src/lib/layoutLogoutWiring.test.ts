import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: logout must end the Firebase session and return to /login. */
describe('Layout.tsx logout wiring', () => {
  const source = readFileSync(resolve(__dirname, '../components/Layout.tsx'), 'utf8');

  it('signs out via the shared auth instance before navigation', () => {
    expect(source).toMatch(/const handleLogout = async/);
    expect(source).toMatch(/await auth\.signOut\(\)/);
    expect(source).toMatch(/navigate\('\/login'\)/);
    expect(source).toMatch(/onClick=\{handleLogout\}/);
  });

  it('does not leave a hard redirect to a protected path after logout', () => {
    expect(source).not.toMatch(/navigate\('\/'\)/);
    expect(source).not.toMatch(/window\.location/);
  });
});