import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: logout must end Firebase session before routing to /login. */
describe('Layout.tsx logout wiring', () => {
  const source = readFileSync(resolve(__dirname, '../components/Layout.tsx'), 'utf8');

  it('defines handleLogout with signOut then navigate to login', () => {
    expect(source).toMatch(/const handleLogout = async/);
    expect(source).toMatch(/await auth\.signOut\(\)/);
    expect(source).toMatch(/navigate\('\/login'\)/);
  });

  it('awaits signOut before navigation (prevents guest flash on protected routes)', () => {
    const logoutBlock = source.match(
      /const handleLogout = async \(\) => \{[\s\S]*?\n  \};/
    )?.[0];
    expect(logoutBlock).toBeTruthy();
    const signOutIdx = logoutBlock!.indexOf('signOut');
    const navigateIdx = logoutBlock!.indexOf("navigate('/login')");
    expect(signOutIdx).toBeGreaterThanOrEqual(0);
    expect(navigateIdx).toBeGreaterThan(signOutIdx);
  });

  it('wires logout control to handleLogout', () => {
    expect(source).toMatch(/onClick=\{handleLogout\}/);
    expect(source).toMatch(/تسجيل الخروج/);
  });
});