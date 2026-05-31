import { describe, it, expect } from 'vitest';
import {
  ATTENDANCE_STATUSES,
  BOOTSTRAP_ADMIN_EMAIL,
  buildStaffFallbackFromRole,
  canSeeAllClasses,
  deriveAuthRoleFlags,
  getRoleLabel,
  mergeStaffWithRoleDocument,
  resolveEffectiveNavRole,
  roleCanAccessNav,
  shouldBootstrapAdminRole,
} from './roles';
import type { StaffMember } from '../types';

describe('deriveAuthRoleFlags', () => {
  it('marks ADMIN correctly', () => {
    expect(deriveAuthRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher', () => {
    expect(deriveAuthRoleFlags('TEACHER_LEADER').isTeacher).toBe(true);
  });

  it('does not grant teacher flag to ATTENDANCE_OFFICER', () => {
    expect(deriveAuthRoleFlags('ATTENDANCE_OFFICER')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('canSeeAllClasses', () => {
  it('allows admin and attendance officer', () => {
    expect(canSeeAllClasses(true, undefined)).toBe(true);
    expect(canSeeAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
  });

  it('restricts plain teachers', () => {
    expect(canSeeAllClasses(false, 'TEACHER')).toBe(false);
  });
});

describe('resolveEffectiveNavRole', () => {
  it('prefers staff appRole when set', () => {
    expect(resolveEffectiveNavRole('SUPERVISOR', false)).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin without appRole', () => {
    expect(resolveEffectiveNavRole(undefined, true)).toBe('ADMIN');
  });

  it('defaults to TEACHER', () => {
    expect(resolveEffectiveNavRole(undefined, false)).toBe('TEACHER');
  });
});

describe('roleCanAccessNav', () => {
  const adminOnly = ['ADMIN'] as const;

  it('allows matching roles', () => {
    expect(roleCanAccessNav('ADMIN', adminOnly)).toBe(true);
  });

  it('denies mismatched roles', () => {
    expect(roleCanAccessNav('TEACHER', adminOnly)).toBe(false);
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without a role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(
      false
    );
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('mergeStaffWithRoleDocument', () => {
  const baseStaff: StaffMember = {
    fullName: 'Test',
    nationalId: '1',
    phone: '05',
    role: 'معلم',
    email: 't@ghiabi.com',
    specialization: 'math',
  };

  it('overwrites appRole when roles collection has a value', () => {
    const merged = mergeStaffWithRoleDocument(baseStaff, { role: 'ADMIN' });
    expect(merged.appRole).toBe('ADMIN');
  });

  it('keeps staff record when roles document is missing', () => {
    expect(mergeStaffWithRoleDocument(baseStaff, null).appRole).toBeUndefined();
  });
});

describe('buildStaffFallbackFromRole', () => {
  it('builds minimal staff profile from role document', () => {
    const staff = buildStaffFallbackFromRole('u@ghiabi.com', null, {
      role: 'TEACHER',
    });
    expect(staff.email).toBe('u@ghiabi.com');
    expect(staff.appRole).toBe('TEACHER');
    expect(staff.fullName).toBe('مستخدم جديد');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('ATTENDANCE_STATUSES', () => {
  it('matches Firestore rules enum', () => {
    expect(ATTENDANCE_STATUSES).toEqual([
      'حاضر',
      'غائب',
      'متأخر',
      'بعذر',
    ]);
  });
});
