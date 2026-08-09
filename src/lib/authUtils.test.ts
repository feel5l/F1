import { describe, it, expect } from 'vitest';
import {
  toLoginEmail,
  shouldBootstrapAdminRole,
  deriveAuthRoleFlags,
  resolveStaffMember,
  BOOTSTRAP_ADMIN_EMAIL,
  GHIABI_EMAIL_DOMAIN,
} from '../lib/authUtils';
import { StaffMember } from '../types';

describe('toLoginEmail', () => {
  it('appends school domain for bare usernames', () => {
    expect(toLoginEmail('zayd12345')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
  });

  it('preserves full email addresses', () => {
    expect(toLoginEmail('teacher@example.com')).toBe('teacher@example.com');
    expect(toLoginEmail('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
  });

  it('trims surrounding whitespace', () => {
    expect(toLoginEmail('  zayd12345  ')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
    expect(toLoginEmail('  user@ghiabi.com  ')).toBe('user@ghiabi.com');
  });

  it('does not double-append domain when @ is present', () => {
    const email = 'custom@school.edu';
    expect(toLoginEmail(email)).toBe(email);
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('returns true only for bootstrap admin without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('returns false when role already exists', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'TEACHER' })).toBe(false);
  });

  it('returns false for other emails', () => {
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('deriveAuthRoleFlags', () => {
  it('identifies admin', () => {
    expect(deriveAuthRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats teacher leaders as teachers', () => {
    expect(deriveAuthRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('identifies supervisors separately from teachers', () => {
    expect(deriveAuthRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });

  it('returns false flags when role is undefined', () => {
    expect(deriveAuthRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('resolveStaffMember', () => {
  const baseStaff: StaffMember = {
    id: 'staff-1',
    fullName: 'أحمد',
    nationalId: '123',
    phone: '0500000000',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'رياضيات',
    email: 'teacher@ghiabi.com',
  };

  it('prefers roles collection over staff appRole', () => {
    const result = resolveStaffMember({
      staffDoc: baseStaff,
      roleData: { role: 'ADMIN' },
      authUser: { email: 'teacher@ghiabi.com' },
    });

    expect(result?.appRole).toBe('ADMIN');
    expect(result?.fullName).toBe('أحمد');
  });

  it('keeps staff appRole when roles collection is empty', () => {
    const result = resolveStaffMember({
      staffDoc: baseStaff,
      roleData: null,
      authUser: { email: 'teacher@ghiabi.com' },
    });

    expect(result?.appRole).toBe('TEACHER');
  });

  it('creates fallback profile from roles when staff doc is missing', () => {
    const result = resolveStaffMember({
      staffDoc: null,
      roleData: { role: 'ATTENDANCE_OFFICER' },
      authUser: { email: 'officer@ghiabi.com', displayName: 'مسؤول' },
    });

    expect(result).toEqual({
      fullName: 'مسؤول',
      email: 'officer@ghiabi.com',
      phone: '',
      role: 'موظف',
      appRole: 'ATTENDANCE_OFFICER',
      specialization: '',
      nationalId: '',
    });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(
      resolveStaffMember({
        staffDoc: null,
        roleData: null,
        authUser: { email: 'unknown@ghiabi.com' },
      })
    ).toBeNull();
  });
});
