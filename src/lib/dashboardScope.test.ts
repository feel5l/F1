import { describe, it, expect } from 'vitest';
import {
  teacherClassIdsFromClasses,
  countStudentsAssignedToClasses,
  dashboardEnrolledStudentCount,
} from './dashboardScope';

describe('teacherClassIdsFromClasses', () => {
  const classes = [
    { id: 'c1', name: '1/أ', teacherEmail: 't1@school.com' },
    { id: 'c2', name: '1/ب', teacherEmail: 't2@school.com' },
    { id: 'c3', name: '2/أ', teacherEmail: 't1@school.com' },
  ];

  it('returns class ids for matching teacher only', () => {
    expect(teacherClassIdsFromClasses(classes, 't1@school.com')).toEqual(['c1', 'c3']);
  });

  it('returns empty when email is missing', () => {
    expect(teacherClassIdsFromClasses(classes, null)).toEqual([]);
    expect(teacherClassIdsFromClasses(classes, undefined)).toEqual([]);
  });
});

describe('countStudentsAssignedToClasses', () => {
  const students = [
    { classId: 'c1' },
    { classId: 'c1' },
    { classId: 'c2' },
    { classId: 'c3' },
  ];

  it('counts students in allowed class ids', () => {
    expect(countStudentsAssignedToClasses(students, ['c1', 'c3'])).toBe(3);
  });

  it('returns 0 when no classes assigned', () => {
    expect(countStudentsAssignedToClasses(students, [])).toBe(0);
  });
});

describe('dashboardEnrolledStudentCount', () => {
  const students = [{ classId: 'c1' }, { classId: 'c2' }];

  it('uses school-wide total for admin', () => {
    expect(dashboardEnrolledStudentCount(true, 500, students, [])).toBe(500);
  });

  it('scopes to teacher classes for non-admin', () => {
    expect(dashboardEnrolledStudentCount(false, 500, students, ['c1'])).toBe(1);
  });
});