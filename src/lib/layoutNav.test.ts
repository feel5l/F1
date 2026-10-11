import { describe, it, expect } from 'vitest';
import { ROUTE_ACCESS } from './routeAccess';
import { isNavItemVisible, resolveEffectiveRole } from './permissions';
import { AppRole } from '../types';

/** Mirrors Layout.tsx navItems — paths and role lists must stay aligned. */
const LAYOUT_NAV_ITEMS = [
  { path: '/', roles: ROUTE_ACCESS['/'] },
  { path: '/students', roles: ROUTE_ACCESS['/students'] },
  { path: '/staff', roles: ROUTE_ACCESS['/staff'] },
  { path: '/classes', roles: ROUTE_ACCESS['/classes'] },
  { path: '/attendance', roles: ROUTE_ACCESS['/attendance'] },
  { path: '/logs', roles: ROUTE_ACCESS['/logs'] },
  { path: '/reports', roles: ROUTE_ACCESS['/reports'] },
] as const;

const ALL_ROLES: AppRole[] = [
  'ADMIN',
  'TEACHER',
  'TEACHER_LEADER',
  'ATTENDANCE_OFFICER',
  'SUPERVISOR',
];

function visibleLayoutPathsForRole(role: AppRole): string[] {
  return LAYOUT_NAV_ITEMS
    .filter((item) => isNavItemVisible(item.roles, role))
    .map((item) => item.path)
    .sort();
}

describe('Layout nav parity with ROUTE_ACCESS', () => {
  it('covers every protected route exactly once in the sidebar', () => {
    const navPaths = LAYOUT_NAV_ITEMS.map((item) => item.path).sort();
    expect(navPaths).toEqual(Object.keys(ROUTE_ACCESS).sort());
  });

  it('shows the same routes as canAccessRoute for each structured role', () => {
    for (const role of ALL_ROLES) {
      const fromNav = visibleLayoutPathsForRole(role);
      const fromAccess = Object.keys(ROUTE_ACCESS)
        .filter((path) => isNavItemVisible(ROUTE_ACCESS[path], role))
        .sort();
      expect(fromNav, `sidebar drift for ${role}`).toEqual(fromAccess);
    }
  });

  it('hides staff management from teachers in the sidebar', () => {
    const teacherRole = resolveEffectiveRole('TEACHER', false);
    expect(visibleLayoutPathsForRole(teacherRole as AppRole)).toEqual(['/', '/attendance']);
  });
});
