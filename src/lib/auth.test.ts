import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  normalizeGhiyabiEmail,
  shouldBootstrapAdmin,
  isGooglePopupFallbackError,
  deriveRoleFlags,
  resolveStaffMember,
} from './auth';
import { StaffMember } from '../types';

describe('normalizeGhiyabiEmail', () => {
  it('appends @ghiabi.com for bare usernames', () => {
    expect(normalizeGhiyabiEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeGhiyabiEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeGhiyabiEmail('teacher@example.com')).toBe('teacher@example.com');
    expect(normalizeGhiyabiEmail('user@ghiabi.com')).toBe('user@ghiabi.com');
  });
});

describe('shouldBootstrapAdmin', () => {
  it('returns true only for the bootstrap admin email', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
    expect(shouldBootstrapAdmin('other@gmail.com')).toBe(false);
    expect(shouldBootstrapAdmin('alzaem2002@gmail.com')).toBe(false);
  });
});

describe('isGooglePopupFallbackError', () => {
  it('detects popup-blocked and popup-closed-by-user codes', () => {
    expect(isGooglePopupFallbackError({ code: 'auth/popup-blocked' })).toBe(true);
    expect(isGooglePopupFallbackError({ code: 'auth/popup-closed-by-user' })).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(isGooglePopupFallbackError({ code: 'auth/invalid-credential' })).toBe(false);
    expect(isGooglePopupFallbackError({})).toBe(false);
  });
});

describe('deriveRoleFlags', () => {
  it('identifies admin role', () => {
    expect(deriveRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats teacher leader as teacher', () => {
    expect(deriveRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('returns all false when role is undefined', () => {
    expect(deriveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('resolveStaffMember', () => {
  const authUser = { email: 'teacher@ghiabi.com', displayName: 'Teacher Name' };

  it('merges roles collection appRole over staff document', () => {
    const staffDoc: StaffMember = {
      id: 's1',
      fullName: 'From Staff',
      email: 'teacher@ghiabi.com',
      nationalId: '123',
      phone: '0500000000',
      role: 'معلم',
      appRole: 'TEACHER',
      specialization: 'Math',
    };

    const result = resolveStaffMember({
      authUser,
      staffDoc,
      roleData: { role: 'ADMIN' },
    });

    expect(result?.appRole).toBe('ADMIN');
    expect(result?.fullName).toBe('From Staff');
  });

  it('creates fallback staff member from roles when staff doc is missing', () => {
    const result = resolveStaffMember({
      authUser,
      staffDoc: null,
      roleData: { role: 'SUPERVISOR' },
    });

    expect(result).toEqual({
      fullName: 'Teacher Name',
      email: 'teacher@ghiabi.com',
      phone: '',
      role: 'موظف',
      appRole: 'SUPERVISOR',
      specialization: '',
      nationalId: '',
    });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(
      resolveStaffMember({
        authUser,
        staffDoc: null,
        roleData: null,
      })
    ).toBeNull();
  });
});
