import { describe, it, expect } from 'vitest';
import type { AppRole, Class } from '../types';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  canSeeAllClasses,
  deriveAuthFlags,
  filterClassesForUser,
  filterNavItemsByRole,
  getRoleLabel,
  isBootstrapAdminEmail,
  resolveEffectiveRole,
} from './rbac';

const sampleClasses: Class[] = [
  { id: '1', name: 'A', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: '2', name: 'B', gradeLevel: '2', teacherEmail: 'other@ghiabi.com' },
];

describe('deriveAuthFlags', () => {
  it('maps ADMIN, teacher roles, and supervisor correctly', () => {
    expect(deriveAuthFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
    expect(deriveAuthFlags('TEACHER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
    expect(deriveAuthFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
    expect(deriveAuthFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
    expect(deriveAuthFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('isBootstrapAdminEmail', () => {
  it('only matches the configured bootstrap admin', () => {
    expect(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
    expect(isBootstrapAdminEmail('other@example.com')).toBe(false);
    expect(isBootstrapAdminEmail(null)).toBe(false);
  });
});

describe('resolveEffectiveRole', () => {
  it('prefers appRole when set', () => {
    expect(resolveEffectiveRole('ATTENDANCE_OFFICER', true)).toBe('ATTENDANCE_OFFICER');
  });

  it('falls back to ADMIN or TEACHER when appRole is missing', () => {
    expect(resolveEffectiveRole(undefined, true)).toBe('ADMIN');
    expect(resolveEffectiveRole(undefined, false)).toBe('TEACHER');
  });
});

describe('filterNavItemsByRole', () => {
  const items = [
    { path: '/classes', roles: ['ADMIN'] as AppRole[] },
    { path: '/attendance', roles: ['ADMIN', 'TEACHER'] as AppRole[] },
  ];

  it('hides admin-only routes from teachers', () => {
    const visible = filterNavItemsByRole(items, 'TEACHER');
    expect(visible.map((i) => i.path)).toEqual(['/attendance']);
  });

  it('shows admin routes for ADMIN', () => {
    expect(filterNavItemsByRole(items, 'ADMIN').map((i) => i.path)).toEqual([
      '/classes',
      '/attendance',
    ]);
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('filterClassesForUser', () => {
  it('returns all classes for roles that manage attendance broadly', () => {
    for (const role of ['ATTENDANCE_OFFICER', 'TEACHER_LEADER', 'SUPERVISOR'] as AppRole[]) {
      expect(
        filterClassesForUser(sampleClasses, {
          appRole: role,
          isAdmin: false,
          userEmail: 'teacher@ghiabi.com',
        })
      ).toHaveLength(2);
    }
    expect(
      filterClassesForUser(sampleClasses, {
        isAdmin: true,
        userEmail: 'teacher@ghiabi.com',
      })
    ).toHaveLength(2);
  });

  it('restricts plain teachers to their assigned classes', () => {
    const result = filterClassesForUser(sampleClasses, {
      appRole: 'TEACHER',
      isAdmin: false,
      userEmail: 'teacher@ghiabi.com',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('canSeeAllClasses', () => {
  it('is false for teachers without elevated roles', () => {
    expect(canSeeAllClasses('TEACHER', false)).toBe(false);
  });
});
