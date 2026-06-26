import { describe, it, expect } from 'vitest';
import { getVisibleNavPaths, getRoleLabel, canSeeAllClasses } from './rbac';

describe('getVisibleNavPaths', () => {
  it('limits TEACHER to dashboard and attendance', () => {
    const paths = getVisibleNavPaths('TEACHER');
    expect(paths).toContain('/');
    expect(paths).toContain('/attendance');
    expect(paths).not.toContain('/students');
    expect(paths).not.toContain('/classes');
  });

  it('grants ADMIN all navigation paths', () => {
    const paths = getVisibleNavPaths('ADMIN');
    expect(paths).toEqual(['/', '/students', '/staff', '/classes', '/attendance', '/logs', '/reports']);
  });

  it('allows SUPERVISOR staff and reports but not attendance', () => {
    const paths = getVisibleNavPaths('SUPERVISOR');
    expect(paths).toContain('/staff');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/attendance');
  });

  it('allows ATTENDANCE_OFFICER attendance and logs but not reports', () => {
    const paths = getVisibleNavPaths('ATTENDANCE_OFFICER');
    expect(paths).toContain('/attendance');
    expect(paths).toContain('/logs');
    expect(paths).not.toContain('/reports');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER_LEADER')).toBe('رائد نشاط / رئيس قسم');
  });

  it('falls back to موظف for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('canSeeAllClasses', () => {
  it('returns true for admin and elevated roles', () => {
    expect(canSeeAllClasses(true, 'TEACHER')).toBe(true);
    expect(canSeeAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canSeeAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canSeeAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('returns false for regular teacher', () => {
    expect(canSeeAllClasses(false, 'TEACHER')).toBe(false);
  });
});
