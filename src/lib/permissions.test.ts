import { describe, it, expect } from 'vitest';
import {
  deriveRoleFlags,
  resolveCurrentRole,
  getVisibleNavPaths,
  canSeeAllClasses,
  filterClassesForTeacher,
  filterStaffBySearch,
  getRoleLabel,
} from './permissions';
import { Class, StaffMember } from '../types';

describe('deriveRoleFlags', () => {
  it('marks only ADMIN as admin', () => {
    expect(deriveRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher but not supervisor', () => {
    expect(deriveRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('returns false for all flags when role is undefined', () => {
    expect(deriveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('resolveCurrentRole', () => {
  it('prefers explicit appRole', () => {
    expect(resolveCurrentRole('SUPERVISOR', true)).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin is true', () => {
    expect(resolveCurrentRole(undefined, true)).toBe('ADMIN');
  });

  it('defaults to TEACHER when no role and not admin', () => {
    expect(resolveCurrentRole(undefined, false)).toBe('TEACHER');
  });
});

describe('getVisibleNavPaths', () => {
  it('gives teachers attendance but not staff management', () => {
    const paths = getVisibleNavPaths('TEACHER');
    expect(paths).toContain('/');
    expect(paths).toContain('/attendance');
    expect(paths).not.toContain('/staff');
    expect(paths).not.toContain('/classes');
  });

  it('gives supervisors staff and reports but not class management', () => {
    const paths = getVisibleNavPaths('SUPERVISOR');
    expect(paths).toContain('/staff');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/attendance');
  });

  it('gives admins every route', () => {
    const paths = getVisibleNavPaths('ADMIN');
    expect(paths).toEqual([
      '/',
      '/students',
      '/staff',
      '/classes',
      '/attendance',
      '/logs',
      '/reports',
    ]);
  });
});

describe('canSeeAllClasses', () => {
  it('allows attendance officers and teacher leaders to see all classes', () => {
    expect(canSeeAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canSeeAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canSeeAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('denies plain teachers unless they are admin', () => {
    expect(canSeeAllClasses(false, 'TEACHER')).toBe(false);
    expect(canSeeAllClasses(true, 'TEACHER')).toBe(true);
  });
});

describe('filterClassesForTeacher', () => {
  const classes: Class[] = [
    { id: '1', name: '1/أ', gradeLevel: '1', teacherEmail: 'a@school.com' },
    { id: '2', name: '1/ب', gradeLevel: '1', teacherEmail: 'b@school.com' },
  ];

  it('returns only classes assigned to the teacher email', () => {
    expect(filterClassesForTeacher(classes, 'a@school.com')).toEqual([classes[0]]);
  });
});

describe('filterStaffBySearch', () => {
  const staff: StaffMember[] = [
    {
      fullName: 'أحمد محمد',
      nationalId: '1234567890',
      phone: '0500000000',
      role: 'معلم',
      appRole: 'TEACHER',
      specialization: 'رياضيات',
      email: 'ahmad@ghiabi.com',
    },
    {
      fullName: 'سارة علي',
      nationalId: '9876543210',
      phone: '0501111111',
      role: 'مشرفة',
      appRole: 'SUPERVISOR',
      specialization: 'إدارة',
      email: 'sara@ghiabi.com',
    },
  ];

  it('matches by name case-insensitively', () => {
    expect(filterStaffBySearch(staff, 'أحمد')).toHaveLength(1);
  });

  it('matches by national ID exactly', () => {
    expect(filterStaffBySearch(staff, '9876543210')).toHaveLength(1);
  });

  it('returns empty list when nothing matches', () => {
    expect(filterStaffBySearch(staff, 'zzz')).toHaveLength(0);
  });
});

describe('getRoleLabel', () => {
  it('maps known roles to Arabic labels', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('returns generic label for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
