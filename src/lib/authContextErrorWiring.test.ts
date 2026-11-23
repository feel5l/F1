import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guards: failed or partial staff resolution must not leave stale
 * privileges or hang the app shell (pairs with authProviderWiring loading gate).
 */
describe('AuthContext.tsx staff resolution failure paths', () => {
  const source = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('clears staff when the Firebase user is missing or has no email', () => {
    expect(source).toMatch(/if \(authUser && authUser\.email\)/);
    expect(source).toMatch(/} else \{[\s\S]*setStaffMember\(null\)/);
  });

  it('nulls staff after Firestore errors instead of keeping a prior session role', () => {
    expect(source).toMatch(/catch \(error\)/);
    const catchBlock = source.match(/catch \(error\) \{([\s\S]*?)\}/)?.[1] ?? '';
    expect(catchBlock).toMatch(/setStaffMember\(null\)/);
  });

  it('always ends the loading cycle after staff resolution attempt', () => {
    expect(source).toMatch(/setLoading\(false\)/);
    const afterStaffBranch = source.split('if (authUser && authUser.email)')[1] ?? '';
    expect(afterStaffBranch.indexOf('setLoading(false)')).toBeGreaterThan(-1);
  });

  it('gates admin bootstrap behind shouldBootstrapAdminRole only', () => {
    expect(source).toMatch(/if \(shouldBootstrapAdminRole\(authUser\.email, roleData\)\)/);
    expect(source).toMatch(/buildAdminBootstrapRoleDoc\(\)/);
    expect(source).not.toMatch(/alzaem3000@gmail\.com/);
    expect(source).not.toMatch(/BOOTSTRAP_ADMIN_EMAIL/);
  });
});