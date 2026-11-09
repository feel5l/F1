import type { AppRole } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export interface AuthRoleFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

export function deriveAuthRoleFlags(appRole?: AppRole): AuthRoleFlags {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Whether the user may see all classes (not only those tied to teacherEmail). */
export function canViewAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  if (isAdmin) return true;
  return (
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function shouldBootstrapAdminRole(
  email: string | null | undefined,
  roleData: { role?: string } | null | undefined
): boolean {
  return Boolean(email === BOOTSTRAP_ADMIN_EMAIL && !roleData?.role);
}

export function resolveEffectiveRole(
  staffAppRole?: AppRole,
  isAdminFallback?: boolean
): AppRole | 'TEACHER' {
  if (staffAppRole) return staffAppRole;
  return isAdminFallback ? 'ADMIN' : 'TEACHER';
}

export function isRoleAllowedForNav(currentRole: AppRole | string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(currentRole);
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
