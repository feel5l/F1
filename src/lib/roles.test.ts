import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  canViewAllClasses,
  deriveAuthRoleFlags,
  filterNavItemsByRole,
  getRoleLabel,
  shouldBootstrapAdminRole,
} from './roles';

describe('shouldBootstrapAdminRole', () => {
  it('identifies bootstrap admin email only for exact match', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
    expect(shouldBootstrapAdminRole('alzaem3000@gmail.com ')).toBe(false);
    expect(shouldBootstrapAdminRole(null)).toBe(false);
    expect(shouldBootstrapAdminRole('other@gmail.com')).toBe(false);
  });
});

describe('deriveAuthRoleFlags', () => {
  it('marks ADMIN correctly', () => {
    expect(deriveAuthRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher but not admin', () => {
    expect(deriveAuthRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
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

describe('canViewAllClasses', () => {
  it('allows admin regardless of appRole', () => {
    expect(canViewAllClasses(undefined, true)).toBe(true);
    expect(canViewAllClasses('TEACHER', true)).toBe(true);
  });

  it('allows elevated staff roles', () => {
    expect(canViewAllClasses('ATTENDANCE_OFFICER')).toBe(true);
    expect(canViewAllClasses('TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses('SUPERVISOR')).toBe(true);
  });

  it('denies plain teachers without admin flag', () => {
    expect(canViewAllClasses('TEACHER')).toBe(false);
    expect(canViewAllClasses(undefined)).toBe(false);
  });
});

describe('filterNavItemsByRole', () => {
  const items = [
    { name: 'Dashboard', roles: ['ADMIN', 'TEACHER'] },
    { name: 'Staff', roles: ['ADMIN', 'SUPERVISOR'] },
  ];

  it('returns only items allowed for the current role', () => {
    expect(filterNavItemsByRole(items, 'TEACHER')).toEqual([items[0]]);
    expect(filterNavItemsByRole(items, 'SUPERVISOR')).toEqual([items[1]]);
  });

  it('returns empty list when role has no matching nav entries', () => {
    expect(filterNavItemsByRole(items, 'ATTENDANCE_OFFICER')).toEqual([]);
  });
});

describe('getRoleLabel', () => {
  it('maps known roles to Arabic labels', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('falls back for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
