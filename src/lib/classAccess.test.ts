import { describe, it, expect } from 'vitest';
import { filterClassesForUser } from './classAccess';
import type { Class } from '../types';

const classes: Class[] = [
  { id: '1', name: 'A', gradeLevel: '1', teacherEmail: 't1@ghiabi.com' },
  { id: '2', name: 'B', gradeLevel: '1', teacherEmail: 't2@ghiabi.com' },
];

describe('filterClassesForUser', () => {
  it('returns all classes when canViewAll is true', () => {
    expect(filterClassesForUser(classes, true, 't1@ghiabi.com')).toEqual(classes);
  });

  it('filters to matching teacherEmail only for plain teachers', () => {
    expect(filterClassesForUser(classes, false, 't1@ghiabi.com')).toEqual([classes[0]]);
  });

  it('returns empty when teacher has no assigned classes', () => {
    expect(filterClassesForUser(classes, false, 'unknown@ghiabi.com')).toEqual([]);
  });

  it('returns empty when teacher email is missing', () => {
    expect(filterClassesForUser(classes, false, null)).toEqual([]);
  });
});