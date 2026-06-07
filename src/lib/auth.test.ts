import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  normalizeSchoolEmail,
  shouldBootstrapAdmin,
  deriveAuthFlags,
  isGooglePopupFallbackError,
  resolveStaffMember,
} from './auth';
import { StaffMember } from '../types';

describe('normalizeSchoolEmail', () => {
  it('appends school domain when identifier has no @', () => {
    expect(normalizeSchoolEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeSchoolEmail('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
    expect(normalizeSchoolEmail('user@gmail.com')).toBe('user@gmail.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
    expect(normalizeSchoolEmail('  user@ghiabi.com  ')).toBe('user@ghiabi.com');
  });
});

describe('shouldBootstrapAdmin', () => {
  it('returns true only for bootstrap email without an existing role', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
    expect(shouldBootstrapAdmin('other@ghiabi.com', null)).toBe(false);
  });
});

describe('deriveAuthFlags', () => {
  it('grants admin only for ADMIN role', () => {
    expect(deriveAuthFlags({ appRole: 'ADMIN' })).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER and TEACHER_LEADER as teachers', () => {
    expect(deriveAuthFlags({ appRole: 'TEACHER' }).isTeacher).toBe(true);
    expect(deriveAuthFlags({ appRole: 'TEACHER_LEADER' }).isTeacher).toBe(true);
    expect(deriveAuthFlags({ appRole: 'ADMIN' }).isTeacher).toBe(false);
  });

  it('returns all false when staff member is missing', () => {
    expect(deriveAuthFlags(null)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('does not elevate legacy hardcoded emails without ADMIN role', () => {
    expect(deriveAuthFlags({ appRole: 'TEACHER' }).isAdmin).toBe(false);
    expect(deriveAuthFlags({ appRole: 'ATTENDANCE_OFFICER' }).isAdmin).toBe(false);
  });
});

describe('isGooglePopupFallbackError', () => {
  it('detects popup-blocked and popup-closed-by-user codes', () => {
    expect(isGooglePopupFallbackError('auth/popup-blocked')).toBe(true);
    expect(isGooglePopupFallbackError('auth/popup-closed-by-user')).toBe(true);
    expect(isGooglePopupFallbackError('auth/network-request-failed')).toBe(false);
    expect(isGooglePopupFallbackError(undefined)).toBe(false);
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
    email: 'ahmad@ghiabi.com',
  };

  it('overwrites appRole from roles collection when staff record exists', () => {
    const resolved = resolveStaffMember({
      authEmail: 'ahmad@ghiabi.com',
      staffDoc: baseStaff,
      roleData: { role: 'ADMIN' },
    });
    expect(resolved?.appRole).toBe('ADMIN');
    expect(resolved?.fullName).toBe('أحمد');
  });

  it('keeps staff appRole when roles collection has no role', () => {
    const resolved = resolveStaffMember({
      authEmail: 'ahmad@ghiabi.com',
      staffDoc: baseStaff,
      roleData: null,
    });
    expect(resolved?.appRole).toBe('TEACHER');
  });

  it('creates fallback profile from roles-only user', () => {
    const resolved = resolveStaffMember({
      authEmail: 'new@ghiabi.com',
      authDisplayName: 'سارة',
      staffDoc: null,
      roleData: { role: 'SUPERVISOR' },
    });
    expect(resolved).toMatchObject({
      fullName: 'سارة',
      email: 'new@ghiabi.com',
      appRole: 'SUPERVISOR',
      role: 'موظف',
    });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(
      resolveStaffMember({
        authEmail: 'unknown@ghiabi.com',
        staffDoc: null,
        roleData: null,
      })
    ).toBeNull();
  });
});
