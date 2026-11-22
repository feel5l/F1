import { isRoleAllowedForNav } from './roleAccess';

export interface NavRouteAccess {
  path: string;
  roles: readonly string[];
}

/** Role gates for sidebar routes (must stay aligned with Layout navigation). */
export const NAV_ROUTE_ACCESS: readonly NavRouteAccess[] = [
  {
    path: '/',
    roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'],
  },
  { path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { path: '/classes', roles: ['ADMIN'] },
  {
    path: '/attendance',
    roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'],
  },
  { path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
  { path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
];

export function filterNavRoutesByRole(
  routes: readonly NavRouteAccess[],
  currentRole: string
): NavRouteAccess[] {
  return routes.filter((route) => isRoleAllowedForNav(currentRole, route.roles));
}

export function visibleNavPathsForRole(currentRole: string): string[] {
  return filterNavRoutesByRole(NAV_ROUTE_ACCESS, currentRole).map((route) => route.path);
}