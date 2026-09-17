import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  deriveAuthFlags,
  shouldBootstrapAdminRole,
  shouldFallbackToGoogleRedirect,
} from './auth';

describe('deriveAuthFlags', () => {
  it('grants admin only for ADMIN role', () => {
    expect(deriveAuthFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('does not grant admin for non-admin roles', () => {
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

describe('shouldFallbackToGoogleRedirect', () => {
  it('falls back when popup is blocked or closed by user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('does not fall back for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});
