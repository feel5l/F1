import { AppRole, StaffMember } from '../types';

export const GHIABI_EMAIL_DOMAIN = '@ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

/**
 * Normalizes a username or email into a full login email.
 * Usernames without "@" are suffixed with the school domain.
 */
export function toLoginEmail(identifier: string): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}${GHIABI_EMAIL_DOMAIN}`;
}

export function shouldBootstrapAdminRole(
  email: string,
  roleData: { role?: AppRole } | null
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

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

export interface ResolveStaffMemberInput {
  staffDoc: StaffMember | null;
  roleData: { role?: AppRole } | null;
  authUser: { email: string; displayName?: string | null };
}

/**
 * Merges staff collection data with the roles collection (roles take precedence).
 * Falls back to a minimal staff profile when only a role document exists.
 */
export function resolveStaffMember({
  staffDoc,
  roleData,
  authUser,
}: ResolveStaffMemberInput): StaffMember | null {
  if (staffDoc) {
    const merged = { ...staffDoc };
    if (roleData?.role) {
      merged.appRole = roleData.role;
    }
    return merged;
  }

  if (roleData?.role) {
    return {
      fullName: authUser.displayName || 'مستخدم جديد',
      email: authUser.email,
      phone: '',
      role: 'موظف',
      appRole: roleData.role,
      specialization: '',
      nationalId: '',
    };
  }

  return null;
}
