import { AppRole, StaffMember } from '../types';

export const GHIYABI_EMAIL_DOMAIN = '@ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export const GOOGLE_POPUP_FALLBACK_ERROR_CODES = [
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
] as const;

/**
 * Normalizes a username or email into a full Ghiyabi login identifier.
 * Usernames without "@" receive the school domain suffix.
 */
export function normalizeGhiyabiEmail(identifier: string): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}${GHIYABI_EMAIL_DOMAIN}`;
}

export function shouldFallbackToGoogleRedirect(errorCode?: string): boolean {
  return GOOGLE_POPUP_FALLBACK_ERROR_CODES.includes(
    errorCode as (typeof GOOGLE_POPUP_FALLBACK_ERROR_CODES)[number]
  );
}

export interface RoleFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

export function deriveRoleFlags(staffMember: StaffMember | null): RoleFlags {
  const appRole = staffMember?.appRole;
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

export function shouldBootstrapAdminRole(
  email: string,
  roleData: { role?: string } | null
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

export function canViewAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}
