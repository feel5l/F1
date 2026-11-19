import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: App route shell must stay aligned with authRouting (e2e/smoke_test.py). */
describe('App.tsx auth routing wiring', () => {
  const source = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');

  it('uses resolveAuthRoute for login and authenticated shell decisions', () => {
    expect(source).toMatch(/from '\.\/lib\/authRouting'/);
    expect(source).toMatch(/resolveAuthRoute\('\/login'/);
    expect(source).toMatch(/resolveAuthRoute\(pathname/);
    expect(source).toMatch(/loginDecision/);
    expect(source).toMatch(/shellDecision/);
  });

  it('sends guests away from the app shell to /login', () => {
    expect(source).toMatch(/shellDecision === 'show-app'/);
    expect(source).toMatch(/Navigate to="\/login"/);
  });

  it('does not gate routes on raw user truthiness without authRouting', () => {
    expect(source).not.toMatch(/\{user\s*\?/);
    expect(source).not.toMatch(/!user\s*&&/);
  });
});