import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard: React bootstrap order must keep Router + AuthProvider usable by App.tsx
 * (useLocation/useNavigate + useAuth), and paired with AuthProvider loading gate.
 */
describe('main.tsx auth bootstrap wiring', () => {
  const main = readFileSync(resolve(__dirname, '../main.tsx'), 'utf8');
  const authContext = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');
  const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');

  it('mounts BrowserRouter outside AuthProvider so App can read location', () => {
    const routerIdx = main.indexOf('<BrowserRouter');
    const providerIdx = main.indexOf('<AuthProvider');
    const appIdx = main.indexOf('<App');
    expect(routerIdx).toBeGreaterThan(-1);
    expect(providerIdx).toBeGreaterThan(routerIdx);
    expect(appIdx).toBeGreaterThan(providerIdx);
  });

  it('wraps the app shell and toast inside AuthProvider', () => {
    expect(main).toMatch(/<AuthProvider>[\s\S]*<App/);
    expect(main).toMatch(/<Toaster/);
  });

  it('keeps the dual loading gate that prevents unauthenticated route flashes', () => {
    expect(authContext).toMatch(/\{!loading && children\}/);
    expect(app).toMatch(/if \(loginDecision === 'loading'\) return null/);
  });
});