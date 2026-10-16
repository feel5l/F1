import type { AppRole } from '../types';
import { isRoleAllowedForNav } from './roleAccess';

/** Route paths and roles allowed in the sidebar — keep in sync with Layout nav items. */
export const LAYOUT_NAV_ROUTE_ACCESS: Record<string, readonly AppRole[]> = {
  '/': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'],
  '/students': ['ADMIN', 'TEACHER_LEADER'],
  '/staff': ['ADMIN', 'SUPERVISOR'],
  '/classes': ['ADMIN'],
  '/attendance': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'],
  '/logs': ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'],
  '/reports': ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'],
};

export function visibleNavPathsForRole(role: AppRole | string): string[] {
  return Object.entries(LAYOUT_NAV_ROUTE_ACCESS)
    .filter(([, roles]) => isRoleAllowedForNav(role, roles))
    .map(([path]) => path)
    .sort();
}
