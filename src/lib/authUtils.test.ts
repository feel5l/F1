import { describe, it, expect } from 'vitest';
import {
  normalizeGhiyabiEmail,
  shouldFallbackToGoogleRedirect,
  deriveRoleFlags,
  shouldBootstrapAdminRole,
  canViewAllClasses,
  BOOTSTRAP_ADMIN_EMAIL,
  GHIYABI_EMAIL_DOMAIN,
} from './authUtils';
import { StaffMember } from '../types';

describe('normalizeGhiyabiEmail', () => {
  it('appends school domain for bare usernames', () => {
    expect(normalizeGhiyabiEmail('zayd12345')).toBe(`zayd12345${GHIYABI_EMAIL_DOMAIN}`);
  });

  it('preserves full email addresses', () => {
    expect(normalizeGhiyabiEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeGhiyabiEmail('  zayd12345  ')).toBe(`zayd12345${GHIYABI_EMAIL_DOMAIN}`);
  });
});

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/invalid-credential')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});

describe('deriveRoleFlags', () => {
  const baseStaff = (appRole: StaffMember['appRole']): StaffMember => ({
    fullName: 'Test',
    nationalId: '1',
    phone: '0500000000',
    role: 'موظف',
    email: 'test@ghiabi.com',
    specialization: '',
    appRole,
  });

  it('identifies admin role', () => {
    expect(deriveRoleFlags(baseStaff('ADMIN'))).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats teacher leader as teacher', () => {
    expect(deriveRoleFlags(baseStaff('TEACHER_LEADER'))).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('returns false flags when staff member is missing', () => {
    expect(deriveRoleFlags(null)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('does not bootstrap when role already exists or email differs', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('canViewAllClasses', () => {
  it('allows elevated roles and admins to see all classes', () => {
    expect(canViewAllClasses('ATTENDANCE_OFFICER', false)).toBe(true);
    expect(canViewAllClasses('TEACHER_LEADER', false)).toBe(true);
    expect(canViewAllClasses('SUPERVISOR', false)).toBe(true);
    expect(canViewAllClasses('TEACHER', true)).toBe(true);
  });

  it('restricts regular teachers', () => {
    expect(canViewAllClasses('TEACHER', false)).toBe(false);
    expect(canViewAllClasses(undefined, false)).toBe(false);
  });
});
