import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { deriveAuthRoleFlags } from './roleAccess';

describe('AuthContext security regression (feat(auth) merge)', () => {
  const source = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('does not grant admin from raw Firebase email bypasses', () => {
    expect(source).not.toMatch(/isAdmin\s*=.*user\?\.email/);
    expect(source).not.toMatch(/alzaem2002/);
    expect(source).not.toMatch(/alzaem3000@gmail\.com/);
    expect(source).not.toMatch(/BOOTSTRAP_ADMIN_EMAIL/);
    expect(source).not.toMatch(/zayd12345@ghiabi\.com/);
  });

  it('uses shared helpers for bootstrap, staff merge, and role flags', () => {
    expect(source).toMatch(/deriveAuthRoleFlags/);
    expect(source).toMatch(/shouldBootstrapAdminRole/);
    expect(source).toMatch(/buildAdminBootstrapRoleDoc/);
    expect(source).toMatch(/resolveStaffMemberAfterAuth/);
  });
});

describe('deriveAuthRoleFlags (no email-based admin)', () => {
  it('denies admin without ADMIN appRole regardless of email identity', () => {
    expect(deriveAuthRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
    expect(deriveAuthRoleFlags('TEACHER')).toMatchObject({ isAdmin: false });
  });
});