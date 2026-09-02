import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  deriveAuthFlags,
  shouldBootstrapAdminRole,
} from './auth';

describe('deriveAuthFlags', () => {
  it('grants admin only for ADMIN role', () => {
    expect(deriveAuthFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('does not grant admin for hardcoded-looking emails without ADMIN role', () => {
    // Regression: admin was previously inferred from email allowlist.
    expect(deriveAuthFlags('TEACHER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
    expect(deriveAuthFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('marks TEACHER_LEADER as teacher', () => {
    expect(deriveAuthFlags('TEACHER_LEADER').isTeacher).toBe(true);
    expect(deriveAuthFlags('TEACHER_LEADER').isAdmin).toBe(false);
  });

  it('marks SUPERVISOR correctly', () => {
    expect(deriveAuthFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the designated admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, undefined)).toBe(true);
  });

  it('does not bootstrap when role already exists', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, 'ADMIN')).toBe(false);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, 'TEACHER')).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdminRole('other@gmail.com', null)).toBe(false);
    expect(shouldBootstrapAdminRole(null, null)).toBe(false);
  });
});
