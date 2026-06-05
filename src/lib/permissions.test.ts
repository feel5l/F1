import { describe, it, expect } from 'vitest';
import {
  computeRoleFlags,
  canSeeAllClasses,
  filterClassesForUser,
  getVisibleNavPaths,
  getRoleLabel,
} from './permissions';
import { Class } from '../types';

const sampleClasses: Class[] = [
  { id: 'c1', name: '1/أ', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: 'c2', name: '2/ب', gradeLevel: '2', teacherEmail: 'other@ghiabi.com' },
];

describe('computeRoleFlags', () => {
  it('maps app roles to UI permission flags', () => {
    expect(computeRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
    expect(computeRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
    expect(computeRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });
});

describe('filterClassesForUser', () => {
  it('returns all classes for elevated roles', () => {
    expect(filterClassesForUser(sampleClasses, 'teacher@ghiabi.com', 'SUPERVISOR', false)).toHaveLength(2);
    expect(filterClassesForUser(sampleClasses, 'teacher@ghiabi.com', undefined, true)).toHaveLength(2);
  });

  it('scopes teachers to their assigned classes', () => {
    const filtered = filterClassesForUser(sampleClasses, 'teacher@ghiabi.com', 'TEACHER', false);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('c1');
  });
});

describe('canSeeAllClasses', () => {
  it('allows attendance officers and teacher leaders to see all classes', () => {
    expect(canSeeAllClasses('ATTENDANCE_OFFICER')).toBe(true);
    expect(canSeeAllClasses('TEACHER_LEADER')).toBe(true);
    expect(canSeeAllClasses('TEACHER')).toBe(false);
  });
});

describe('getVisibleNavPaths', () => {
  it('exposes admin-only routes to admins', () => {
    const paths = getVisibleNavPaths('ADMIN', true);
    expect(paths).toContain('/classes');
    expect(paths).toContain('/staff');
  });

  it('hides class management from teachers', () => {
    const paths = getVisibleNavPaths('TEACHER', false);
    expect(paths).not.toContain('/classes');
    expect(paths).toContain('/attendance');
  });

  it('allows supervisors to view staff and reports only among restricted pages', () => {
    const paths = getVisibleNavPaths('SUPERVISOR', false);
    expect(paths).toContain('/staff');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/attendance');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
