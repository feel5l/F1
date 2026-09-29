import type { AppRole, Class } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export function isBootstrapAdminEmail(email: string | null | undefined): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

export function deriveAuthFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Matches Layout fallback when `appRole` is missing on the staff record. */
export function resolveEffectiveRole(
  appRole?: AppRole,
  isAdminFallback = false
): AppRole | 'TEACHER' {
  return appRole ?? (isAdminFallback ? 'ADMIN' : 'TEACHER');
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'مدير نظام';
    case 'TEACHER':
      return 'معلم';
    case 'TEACHER_LEADER':
      return 'رائد نشاط / رئيس قسم';
    case 'ATTENDANCE_OFFICER':
      return 'مسؤول غياب';
    case 'SUPERVISOR':
      return 'مشرف';
    default:
      return 'موظف';
  }
}

export function filterNavItemsByRole<T extends { roles: AppRole[] }>(
  items: T[],
  currentRole: AppRole | string
): T[] {
  return items.filter((item) => item.roles.includes(currentRole as AppRole));
}

export function canSeeAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesForUser(
  classes: Class[],
  options: { appRole?: AppRole; isAdmin: boolean; userEmail?: string | null }
): Class[] {
  if (canSeeAllClasses(options.appRole, options.isAdmin)) {
    return classes;
  }
  return classes.filter((c) => c.teacherEmail === options.userEmail);
}
