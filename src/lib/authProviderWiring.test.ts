import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: AuthProvider must not flash protected UI while Firebase session resolves. */
describe('AuthContext.tsx provider wiring', () => {
  const source = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('withholds children until auth loading completes', () => {
    expect(source).toMatch(/\{!loading && children\}/);
  });

  it('tracks loading from onAuthStateChanged lifecycle', () => {
    expect(source).toMatch(/onAuthStateChanged/);
    expect(source).toMatch(/setLoading\(false\)/);
    expect(source).toMatch(/const \[loading, setLoading\]/);
  });
});

describe('App.tsx auth loading gate (dual guard with AuthProvider)', () => {
  const appSource = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');

  it('returns null while resolveAuthRoute reports loading', () => {
    expect(appSource).toMatch(/loginDecision === 'loading'/);
    expect(appSource).toMatch(/return null/);
    expect(appSource).toMatch(/resolveAuthRoute\('/);
  });
});