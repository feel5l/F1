import { describe, it, expect } from 'vitest';
import { canViewAllClasses, filterClassesForUser } from './permissions';
import { Class } from '../types';

const classes: Class[] = [
  { id: 'c1', name: '1A', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: 'c2', name: '2B', gradeLevel: '2', teacherEmail: 'other@ghiabi.com' },
  { id: 'c3', name: '3C', gradeLevel: '3', teacherEmail: 'teacher@ghiabi.com' },
];

describe('canViewAllClasses', () => {
  it('allows admin', () => {
    expect(canViewAllClasses(true, undefined)).toBe(true);
  });

  it('allows ATTENDANCE_OFFICER, TEACHER_LEADER, and SUPERVISOR', () => {
    expect(canViewAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canViewAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('denies plain TEACHER', () => {
    expect(canViewAllClasses(false, 'TEACHER')).toBe(false);
  });
});

describe('filterClassesForUser', () => {
  it('returns all classes for admin', () => {
    expect(filterClassesForUser(classes, 'teacher@ghiabi.com', true)).toEqual(classes);
  });

  it('returns all classes for supervisor', () => {
    expect(filterClassesForUser(classes, 'teacher@ghiabi.com', false, 'SUPERVISOR')).toEqual(classes);
  });

  it('filters to teacher-assigned classes for plain teachers', () => {
    const result = filterClassesForUser(classes, 'teacher@ghiabi.com', false, 'TEACHER');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.teacherEmail === 'teacher@ghiabi.com')).toBe(true);
  });

  it('returns empty when teacher email does not match any class', () => {
    const result = filterClassesForUser(classes, 'nobody@ghiabi.com', false, 'TEACHER');
    expect(result).toHaveLength(0);
  });
});
