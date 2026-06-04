import { describe, it, expect } from 'vitest';
import {
  deriveAuthFlags,
  resolveEffectiveRole,
  filterNavItemsByRole,
  getRoleLabel,
  canSeeAllClasses,
  filterClassesByTeacherAccess,
} from './roles';

const sampleNav = [
  { path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] as const },
  { path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] as const },
  { path: '/classes', roles: ['ADMIN'] as const },
];

describe('deriveAuthFlags', () => {
  it('marks ADMIN as admin only', () => {
    expect(deriveAuthFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher', () => {
    expect(deriveAuthFlags('TEACHER_LEADER').isTeacher).toBe(true);
  });

  it('marks SUPERVISOR correctly', () => {
    expect(deriveAuthFlags('SUPERVISOR').isSupervisor).toBe(true);
  });
});

describe('resolveEffectiveRole', () => {
  it('uses explicit appRole when present', () => {
    expect(resolveEffectiveRole('ATTENDANCE_OFFICER', true)).toBe('ATTENDANCE_OFFICER');
  });

  it('falls back to ADMIN when isAdmin and no appRole', () => {
    expect(resolveEffectiveRole(undefined, true)).toBe('ADMIN');
  });

  it('falls back to TEACHER when no appRole and not admin', () => {
    expect(resolveEffectiveRole(undefined, false)).toBe('TEACHER');
  });
});

describe('filterNavItemsByRole', () => {
  it('shows full nav for ADMIN', () => {
    expect(filterNavItemsByRole(sampleNav, 'ADMIN').map((i) => i.path)).toEqual([
      '/',
      '/students',
      '/classes',
    ]);
  });

  it('hides admin-only routes for TEACHER', () => {
    const paths = filterNavItemsByRole(sampleNav, 'TEACHER').map((i) => i.path);
    expect(paths).toContain('/');
    expect(paths).not.toContain('/students');
    expect(paths).not.toContain('/classes');
  });

  it('allows TEACHER_LEADER to manage students', () => {
    expect(filterNavItemsByRole(sampleNav, 'TEACHER_LEADER').some((i) => i.path === '/students')).toBe(
      true
    );
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic label for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('class visibility by role', () => {
  it('lets elevated roles see all classes', () => {
    expect(canSeeAllClasses('ATTENDANCE_OFFICER', false)).toBe(true);
    expect(canSeeAllClasses('TEACHER', false)).toBe(false);
    expect(canSeeAllClasses(undefined, true)).toBe(true);
  });

  it('filters homeroom classes for plain teachers', () => {
    const classes = [
      { id: '1', teacherEmail: 'a@school.com' },
      { id: '2', teacherEmail: 'b@school.com' },
    ];
    const visible = filterClassesByTeacherAccess(classes, {
      canSeeAll: false,
      teacherEmail: 'a@school.com',
    });
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('1');
  });
});
