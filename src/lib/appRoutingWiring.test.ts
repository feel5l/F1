import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Guards Playwright smoke intent: unauthenticated users must be sent to /login. */
describe('App.tsx routing (unauthenticated redirect)', () => {
  const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');

  it('exposes /login without requiring auth', () => {
    expect(app).toMatch(/path="\/login"/);
  });

  it('redirects protected routes to login when there is no user', () => {
    expect(app).toMatch(/Navigate to="\/login"/);
    expect(app).toMatch(/user \?/);
  });

  it('renders nothing while auth is loading (avoids flash before /login redirect)', () => {
    expect(app).toMatch(/if \(loading\) return null/);
    expect(app).toMatch(/useAuth\(\)/);
  });
});