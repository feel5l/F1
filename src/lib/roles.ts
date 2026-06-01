import type { AppRole } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export function shouldBootstrapAdminRole(email: string | null | undefined): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

export function deriveAuthRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
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

/** Teachers only see classes they are assigned to; elevated roles see all classes. */
export function canViewAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  if (isAdmin) return true;
  return (
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterNavItemsByRole<T extends { roles: string[] }>(
  items: T[],
  currentRole: string,
): T[] {
  return items.filter((item) => item.roles.includes(currentRole));
}
