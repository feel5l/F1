import { describe, it, expect } from 'vitest';
import { canSeeAllClasses, canAccessRoute, getRoleLabel } from './permissions';

describe('canSeeAllClasses', () => {
  it('allows admin and elevated roles to see all classes', () => {
    expect(canSeeAllClasses('ADMIN', false)).toBe(true);
    expect(canSeeAllClasses('ATTENDANCE_OFFICER', false)).toBe(true);
    expect(canSeeAllClasses('TEACHER_LEADER', false)).toBe(true);
    expect(canSeeAllClasses('SUPERVISOR', false)).toBe(true);
    expect(canSeeAllClasses(undefined, true)).toBe(true);
  });

  it('restricts plain teachers to assigned classes only', () => {
    expect(canSeeAllClasses('TEACHER', false)).toBe(false);
  });
});

describe('canAccessRoute', () => {
  it('allows admins to manage classes', () => {
    expect(canAccessRoute('/classes', 'ADMIN')).toBe(true);
  });

  it('blocks teachers from staff management', () => {
    expect(canAccessRoute('/staff', 'TEACHER')).toBe(false);
    expect(canAccessRoute('/staff', 'SUPERVISOR')).toBe(true);
  });

  it('allows teacher leaders to access students and reports', () => {
    expect(canAccessRoute('/students', 'TEACHER_LEADER')).toBe(true);
    expect(canAccessRoute('/reports', 'TEACHER_LEADER')).toBe(true);
    expect(canAccessRoute('/students', 'TEACHER')).toBe(false);
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER')).toBe('معلم');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('falls back for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
