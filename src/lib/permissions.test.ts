import { describe, it, expect } from 'vitest';
import {
  canViewAllClasses,
  filterClassesByRole,
  filterNavItemsByRole,
  getRoleLabel,
  NavItem,
} from '../lib/permissions';
import { AppRole, Class } from '../types';

const sampleClasses: Class[] = [
  { id: 'c1', name: '1/أ', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: 'c2', name: '2/ب', gradeLevel: '2', teacherEmail: 'other@ghiabi.com' },
];

describe('canViewAllClasses', () => {
  it('grants full visibility to admins', () => {
    expect(canViewAllClasses(true, 'TEACHER')).toBe(true);
    expect(canViewAllClasses(true, undefined)).toBe(true);
  });

  it('grants full visibility to elevated roles', () => {
    expect(canViewAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canViewAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('restricts plain teachers', () => {
    expect(canViewAllClasses(false, 'TEACHER')).toBe(false);
    expect(canViewAllClasses(false, undefined)).toBe(false);
  });
});

describe('filterClassesByRole', () => {
  it('returns all classes for attendance officers', () => {
    expect(
      filterClassesByRole(sampleClasses, {
        isAdmin: false,
        appRole: 'ATTENDANCE_OFFICER',
        userEmail: 'teacher@ghiabi.com',
      })
    ).toHaveLength(2);
  });

  it('filters to assigned classes for teachers', () => {
    const filtered = filterClassesByRole(sampleClasses, {
      isAdmin: false,
      appRole: 'TEACHER',
      userEmail: 'teacher@ghiabi.com',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('c1');
  });
});

describe('filterNavItemsByRole', () => {
  const navItems: Array<NavItem & { extra?: string }> = [
    { name: 'Dashboard', path: '/', roles: ['ADMIN', 'TEACHER'] },
    { name: 'Staff', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  ];

  it('shows only items allowed for the current role', () => {
    expect(filterNavItemsByRole(navItems, 'TEACHER')).toEqual([navItems[0]]);
    expect(filterNavItemsByRole(navItems, 'SUPERVISOR')).toEqual([navItems[1]]);
  });

  it('shows multiple items when role matches several entries', () => {
    expect(filterNavItemsByRole(navItems, 'ADMIN')).toHaveLength(2);
  });
});

describe('getRoleLabel', () => {
  it('maps known roles to Arabic labels', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER_LEADER')).toBe('رائد نشاط / رئيس قسم');
  });

  it('falls back for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
