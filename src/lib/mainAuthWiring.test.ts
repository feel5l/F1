import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: entry shell must wrap routing + auth before App routes run. */
describe('main.tsx auth and router nesting', () => {
  const source = readFileSync(resolve(__dirname, '../main.tsx'), 'utf8');

  it('nests BrowserRouter outside AuthProvider outside App', () => {
    const routerIdx = source.indexOf('<BrowserRouter>');
    const authIdx = source.indexOf('<AuthProvider>');
    const appIdx = source.indexOf('<App');
    expect(routerIdx).toBeGreaterThanOrEqual(0);
    expect(authIdx).toBeGreaterThan(routerIdx);
    expect(appIdx).toBeGreaterThan(authIdx);
  });

  it('imports AuthProvider from the shared auth module', () => {
    expect(source).toMatch(/from '\.\/lib\/AuthContext'/);
    expect(source).toMatch(/AuthProvider/);
  });

  it('keeps Toaster inside AuthProvider so session toasts work post-login', () => {
    expect(source).toMatch(/<Toaster/);
    const authOpen = source.indexOf('<AuthProvider>');
    const authClose = source.indexOf('</AuthProvider>');
    const toasterIdx = source.indexOf('<Toaster');
    expect(toasterIdx).toBeGreaterThan(authOpen);
    expect(toasterIdx).toBeLessThan(authClose);
  });
});