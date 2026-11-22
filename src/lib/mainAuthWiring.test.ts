import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: entry shell must wrap routing + auth provider (feat(auth) Google login). */
describe('main.tsx auth shell wiring', () => {
  const source = readFileSync(resolve(__dirname, '../main.tsx'), 'utf8');

  it('wraps App with BrowserRouter and AuthProvider', () => {
    expect(source).toMatch(/BrowserRouter/);
    expect(source).toMatch(/AuthProvider/);
    expect(source).toMatch(/<App\s*\/>/);
    const routerBeforeAuth =
      source.indexOf('<BrowserRouter') < source.indexOf('<AuthProvider');
    expect(routerBeforeAuth).toBe(true);
  });

  it('does not render App outside AuthProvider', () => {
    const appInsideAuth = /<AuthProvider>[\s\S]*<App\s*\/>/.test(source);
    expect(appInsideAuth).toBe(true);
  });
});