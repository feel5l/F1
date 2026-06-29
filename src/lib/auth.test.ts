import { describe, expect, it } from 'vitest';
import { Class, StaffMember } from '../types';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  canSeeAllClasses,
  createStaffFromRole,
  filterClassesForUser,
  filterStaffBySearch,
  getEffectiveRole,
  getRoleFlags,
  getRoleLabel,
  getVisibleNavPaths,
  mergeStaffWithRole,
  normalizeLoginIdentifier,
  shouldBootstrapAdminRole,
  shouldFallbackToGoogleRedirect,
} from './auth';

const sampleClasses: Class[] = [
  { id: 'c1', name: '1/أ', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: 'c2', name: '2/ب', gradeLevel: '2', teacherEmail: 'leader@ghiabi.com' },
];

const sampleStaff: StaffMember[] = [
  {
    fullName: 'أحمد علي',
    nationalId: '1016956672',
    phone: '0500000000',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'رياضيات',
    email: 'teacher@ghiabi.com',
  },
  {
    fullName: 'سارة محمد',
    nationalId: '1023987314',
    phone: '0501111111',
    role: 'رائد نشاط',
    appRole: 'TEACHER_LEADER',
    specialization: 'لغة عربية',
    email: 'leader@ghiabi.com',
  },
];

describe('normalizeLoginIdentifier', () => {
  it('appends the school domain for username-only identifiers', () => {
    expect(normalizeLoginIdentifier('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeLoginIdentifier('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeLoginIdentifier('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });
});

describe('shouldFallbackToGoogleRedirect', () => {
  it('falls back when the popup is blocked or closed', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('does not fall back for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, undefined)).toBe(true);
  });

  it('does not bootstrap when a role already exists', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, 'ADMIN')).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('getRoleFlags', () => {
  it('marks teachers and teacher leaders as teachers', () => {
    expect(getRoleFlags('TEACHER').isTeacher).toBe(true);
    expect(getRoleFlags('TEACHER_LEADER').isTeacher).toBe(true);
    expect(getRoleFlags('TEACHER_LEADER').isAdmin).toBe(false);
  });

  it('marks supervisors without granting teacher privileges', () => {
    expect(getRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });
});

describe('canSeeAllClasses', () => {
  it('allows privileged roles to see every class', () => {
    expect(canSeeAllClasses(true, undefined)).toBe(true);
    expect(canSeeAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canSeeAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canSeeAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('restricts regular teachers to their own classes', () => {
    expect(canSeeAllClasses(false, 'TEACHER')).toBe(false);
  });
});

describe('filterClassesForUser', () => {
  it('returns all classes for admins', () => {
    expect(filterClassesForUser(sampleClasses, { isAdmin: true })).toEqual(sampleClasses);
  });

  it('scopes classes to the signed-in teacher email', () => {
    expect(
      filterClassesForUser(sampleClasses, {
        isAdmin: false,
        appRole: 'TEACHER',
        userEmail: 'teacher@ghiabi.com',
      }),
    ).toEqual([sampleClasses[0]]);
  });
});

describe('getVisibleNavPaths', () => {
  it('exposes admin-only management routes to admins', () => {
    expect(getVisibleNavPaths('ADMIN')).toEqual(
      expect.arrayContaining(['/classes', '/staff', '/students', '/logs', '/reports']),
    );
  });

  it('hides class management from regular teachers', () => {
    const teacherPaths = getVisibleNavPaths('TEACHER');
    expect(teacherPaths).toContain('/attendance');
    expect(teacherPaths).not.toContain('/classes');
    expect(teacherPaths).not.toContain('/staff');
  });

  it('allows supervisors to view staff and reports only', () => {
    const supervisorPaths = getVisibleNavPaths('SUPERVISOR');
    expect(supervisorPaths).toEqual(expect.arrayContaining(['/staff', '/reports']));
    expect(supervisorPaths).not.toContain('/classes');
    expect(supervisorPaths).not.toContain('/attendance');
  });
});

describe('getEffectiveRole', () => {
  it('falls back to teacher when no structured role exists', () => {
    expect(getEffectiveRole(null, false)).toBe('TEACHER');
    expect(getEffectiveRole({ appRole: undefined }, true)).toBe('ADMIN');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('filterStaffBySearch', () => {
  it('matches by name, role, or national ID', () => {
    expect(filterStaffBySearch(sampleStaff, 'أحمد')).toHaveLength(1);
    expect(filterStaffBySearch(sampleStaff, 'رائد')).toHaveLength(1);
    expect(filterStaffBySearch(sampleStaff, '1023987314')).toHaveLength(1);
    expect(filterStaffBySearch(sampleStaff, 'missing')).toHaveLength(0);
  });
});

describe('mergeStaffWithRole', () => {
  it('overwrites appRole when roles collection has a canonical role', () => {
    const staff = { ...sampleStaff[0], appRole: 'TEACHER' as const };
    expect(mergeStaffWithRole(staff, { role: 'ADMIN' }).appRole).toBe('ADMIN');
  });

  it('preserves staff when no role override exists', () => {
    expect(mergeStaffWithRole(sampleStaff[0], null)).toEqual(sampleStaff[0]);
    expect(mergeStaffWithRole(sampleStaff[0], {})).toEqual(sampleStaff[0]);
  });
});

describe('createStaffFromRole', () => {
  it('builds a minimal staff profile from auth and role data', () => {
    expect(createStaffFromRole('new@ghiabi.com', 'زيد', 'TEACHER')).toEqual({
      fullName: 'زيد',
      email: 'new@ghiabi.com',
      phone: '',
      role: 'موظف',
      appRole: 'TEACHER',
      specialization: '',
      nationalId: '',
    });
  });

  it('falls back to a default display name', () => {
    expect(createStaffFromRole('new@ghiabi.com', null, 'SUPERVISOR').fullName).toBe('مستخدم جديد');
  });
});
