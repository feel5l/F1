import { AppRole } from '../types';
import { isNavItemVisible } from './permissions';

export type EffectiveRole = AppRole | 'TEACHER';

/** Route paths and the roles allowed to access them (mirrors Layout navItems). */
export const ROUTE_ACCESS: Record<string, AppRole[]> = {
  '/': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'],
  '/students': ['ADMIN', 'TEACHER_LEADER'],
  '/staff': ['ADMIN', 'SUPERVISOR'],
  '/classes': ['ADMIN'],
  '/attendance': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'],
  '/logs': ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'],
  '/reports': ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'],
};

/**
 * Returns true when the given role may access the route path.
 */
export function canAccessRoute(path: string, role: EffectiveRole): boolean {
  const allowedRoles = ROUTE_ACCESS[path];
  if (!allowedRoles) return false;
  return isNavItemVisible(allowedRoles, role);
}

/**
 * Returns the default redirect path for unauthorized access attempts.
 */
export function getUnauthorizedRedirect(fallback: string = '/'): string {
  return fallback;
}
