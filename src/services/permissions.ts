import { AppRole, Class } from '../types';

const ALL_CLASSES_ROLES: AppRole[] = ['ATTENDANCE_OFFICER', 'TEACHER_LEADER', 'SUPERVISOR'];

/** Roles that can view all classes (not just their own). */
export function canViewAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return isAdmin || (appRole != null && ALL_CLASSES_ROLES.includes(appRole));
}

/** Filter classes based on user role — teachers see only their assigned classes. */
export function filterClassesForUser(
  classes: Class[],
  userEmail: string | undefined,
  isAdmin: boolean,
  appRole?: AppRole,
): Class[] {
  if (canViewAllClasses(isAdmin, appRole)) {
    return classes;
  }
  return classes.filter((c) => c.teacherEmail === userEmail);
}
