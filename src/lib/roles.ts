import type { AppRole } from '../types';

export function deriveAuthFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Matches Layout fallback when staff record has no appRole yet. */
export function resolveEffectiveRole(appRole?: AppRole, isAdmin = false): AppRole | 'TEACHER' {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export function canAccessNavItem(currentRole: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(currentRole);
}

export function filterNavItemsByRole<T extends { roles: readonly string[] }>(
  items: T[],
  currentRole: string
): T[] {
  return items.filter((item) => canAccessNavItem(currentRole, item.roles));
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

/** Teachers only see their homeroom classes unless elevated. */
export function canSeeAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesByTeacherAccess<T extends { teacherEmail?: string }>(
  classes: T[],
  options: { canSeeAll: boolean; teacherEmail?: string | null }
): T[] {
  if (options.canSeeAll) return classes;
  return classes.filter((c) => c.teacherEmail === options.teacherEmail);
}
