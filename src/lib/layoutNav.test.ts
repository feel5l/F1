import { describe, it, expect } from 'vitest';
import { LAYOUT_NAV_ROUTE_ACCESS, visibleNavPathsForRole } from './layoutNav';
import { resolveEffectiveRole } from './roleAccess';
import { AppRole } from '../types';

const ALL_ROLES: AppRole[] = [
  'ADMIN',
  'TEACHER',
  'TEACHER_LEADER',
  'ATTENDANCE_OFFICER',
  'SUPERVISOR',
];

describe('LAYOUT_NAV_ROUTE_ACCESS', () => {
  it('defines access for every primary app route', () => {
    const paths = Object.keys(LAYOUT_NAV_ROUTE_ACCESS).sort();
    expect(paths).toEqual([
      '/',
      '/attendance',
      '/classes',
      '/logs',
      '/reports',
      '/staff',
      '/students',
    ]);
  });

  it('matches sidebar visibility per role', () => {
    for (const role of ALL_ROLES) {
      const paths = visibleNavPathsForRole(role);
      const expected = Object.entries(LAYOUT_NAV_ROUTE_ACCESS)
        .filter(([, roles]) => roles.includes(role))
        .map(([path]) => path)
        .sort();
      expect(paths, `drift for ${role}`).toEqual(expected);
    }
  });

  it('hides staff and student admin routes from plain teachers', () => {
    const teacherRole = resolveEffectiveRole('TEACHER', false);
    expect(visibleNavPathsForRole(teacherRole)).toEqual(['/', '/attendance']);
  });

  it('grants admin full navigation', () => {
    expect(visibleNavPathsForRole('ADMIN').sort()).toEqual(
      Object.keys(LAYOUT_NAV_ROUTE_ACCESS).sort()
    );
  });
});
