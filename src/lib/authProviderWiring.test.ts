import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard: AuthProvider must not mount the app tree until Firebase auth
 * finishes resolving (pairs with App.tsx loading gate and e2e smoke redirects).
 */
describe('AuthContext.tsx provider wiring', () => {
  const source = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('defers rendering children until loading is false', () => {
    expect(source).toMatch(/\{!loading && children\}/);
  });

  it('uses shared auth merge and bootstrap helpers after Google login merge', () => {
    expect(source).toMatch(/shouldBootstrapAdminRole/);
    expect(source).toMatch(/buildAdminBootstrapRoleDoc/);
    expect(source).toMatch(/resolveStaffMemberAfterAuth/);
    expect(source).toMatch(/deriveAuthRoleFlags/);
  });

  it('does not set loading false before staff resolution attempt completes', () => {
    expect(source).toMatch(/setLoading\(false\)/);
    const loadingFalseAfterStaff = /setStaffMember\([\s\S]*setLoading\(false\)/.test(source);
    expect(loadingFalseAfterStaff).toBe(true);
  });
});