import { describe, it, expect } from 'vitest';
import {
  canViewAllClasses,
  filterClassesForUser,
  isNavItemVisible,
  resolveEffectiveRole,
} from './permissions';
import { AppRole } from '../types';

describe('canViewAllClasses', () => {
  it('allows admin regardless of appRole', () => {
    expect(canViewAllClasses(undefined, true)).toBe(true);
    expect(canViewAllClasses('TEACHER', true)).toBe(true);
  });

  it('allows attendance officer, teacher leader, and supervisor', () => {
    expect(canViewAllClasses('ATTENDANCE_OFFICER', false)).toBe(true);
    expect(canViewAllClasses('TEACHER_LEADER', false)).toBe(true);
    expect(canViewAllClasses('SUPERVISOR', false)).toBe(true);
  });

  it('restricts plain teachers to their own classes', () => {
    expect(canViewAllClasses('TEACHER', false)).toBe(false);
    expect(canViewAllClasses(undefined, false)).toBe(false);
  });
});

describe('resolveEffectiveRole', () => {
  it('prefers explicit appRole', () => {
    expect(resolveEffectiveRole('SUPERVISOR', false)).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin and no appRole', () => {
    expect(resolveEffectiveRole(undefined, true)).toBe('ADMIN');
  });

  it('falls back to TEACHER when no role and not admin', () => {
    expect(resolveEffectiveRole(undefined, false)).toBe('TEACHER');
  });
});

describe('isNavItemVisible', () => {
  const adminOnly: AppRole[] = ['ADMIN'];

  it('shows admin routes only to admin', () => {
    expect(isNavItemVisible(adminOnly, 'ADMIN')).toBe(true);
    expect(isNavItemVisible(adminOnly, 'TEACHER')).toBe(false);
  });
});

describe('filterClassesForUser', () => {
  const classes = [
    { id: '1', name: 'A', teacherEmail: 'teacher@ghiabi.com' },
    { id: '2', name: 'B', teacherEmail: 'other@ghiabi.com' },
  ];

  it('returns all classes for privileged roles', () => {
    expect(filterClassesForUser(classes, 'ATTENDANCE_OFFICER', false, 'teacher@ghiabi.com')).toHaveLength(2);
    expect(filterClassesForUser(classes, undefined, true, 'teacher@ghiabi.com')).toHaveLength(2);
  });

  it('restricts teachers to their own classes', () => {
    expect(filterClassesForUser(classes, 'TEACHER', false, 'teacher@ghiabi.com')).toEqual([
      classes[0],
    ]);
  });

  it('returns empty list when teacher has no matching classes', () => {
    expect(filterClassesForUser(classes, 'TEACHER', false, 'unknown@ghiabi.com')).toEqual([]);
  });
});
