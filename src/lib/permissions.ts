import { AppRole } from '../types';

const ALL_CLASSES_ROLES: AppRole[] = [
  'ADMIN',
  'ATTENDANCE_OFFICER',
  'TEACHER_LEADER',
  'SUPERVISOR',
];

/**
 * Whether the user may see all classes (vs only their own homeroom).
 */
export function canViewAllClasses(
  appRole: AppRole | undefined,
  isAdmin: boolean
): boolean {
  if (isAdmin) return true;
  return appRole !== undefined && ALL_CLASSES_ROLES.includes(appRole);
}

/**
 * Resolves the effective role for navigation when appRole may be unset.
 */
export function resolveEffectiveRole(
  appRole: AppRole | undefined,
  isAdmin: boolean
): AppRole | 'TEACHER' {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

/**
 * Returns true when a nav item should be visible for the given role.
 */
export function isNavItemVisible(
  allowedRoles: AppRole[],
  currentRole: AppRole | 'TEACHER'
): boolean {
  return allowedRoles.includes(currentRole as AppRole);
}
