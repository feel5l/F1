import { AppRole } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';
export const LOGIN_EMAIL_DOMAIN = '@ghiabi.com';

/** Converts username or email input into a Firebase login identifier. */
export function normalizeLoginIdentifier(input: string): string {
  const trimmed = input.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}${LOGIN_EMAIL_DOMAIN}`;
}

export function isBootstrapAdminEmail(email: string): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

export function deriveRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Resolves the effective role used for navigation and UI gating. */
export function resolveDisplayRole(appRole?: AppRole, isAdmin = false): AppRole {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export function canViewNavItem(allowedRoles: readonly AppRole[], userRole: AppRole): boolean {
  return allowedRoles.includes(userRole);
}

/** Mirrors attendance page class-list visibility rules. */
export function canViewAllClasses(appRole?: AppRole): boolean {
  return (
    appRole === 'ADMIN' ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
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
