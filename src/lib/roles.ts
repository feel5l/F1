import type { AppRole, StaffMember } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export const ATTENDANCE_STATUSES = ['حاضر', 'غائب', 'متأخر', 'بعذر'] as const;

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

/** Roles that may list every class on the attendance screen. */
export function canSeeAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function resolveEffectiveNavRole(
  staffAppRole?: AppRole,
  isAdmin?: boolean
): AppRole | 'TEACHER' {
  if (staffAppRole) return staffAppRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export function roleCanAccessNav(
  currentRole: string,
  allowedRoles: readonly string[]
): boolean {
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

export function shouldBootstrapAdminRole(
  email: string,
  roleData: { role?: string } | null | undefined
): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL && !roleData?.role;
}

export function mergeStaffWithRoleDocument(
  staff: StaffMember,
  roleFromDb?: { role?: string } | null
): StaffMember {
  if (roleFromDb?.role) {
    return { ...staff, appRole: roleFromDb.role as AppRole };
  }
  return staff;
}

export function buildStaffFallbackFromRole(
  email: string,
  displayName: string | null | undefined,
  roleFromDb: { role: string }
): StaffMember {
  return {
    fullName: displayName || 'مستخدم جديد',
    email,
    phone: '',
    role: 'موظف',
    appRole: roleFromDb.role as AppRole,
    specialization: '',
    nationalId: '',
  };
}
