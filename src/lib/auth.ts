import { AppRole, StaffMember } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';
export const SCHOOL_EMAIL_DOMAIN = '@ghiabi.com';

/** Normalize username or email to a full school email address. */
export function normalizeSchoolEmail(identifier: string): string {
  const trimmed = identifier.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}${SCHOOL_EMAIL_DOMAIN}`;
}

/** Whether the signed-in user should self-bootstrap ADMIN in roles collection. */
export function shouldBootstrapAdmin(
  email: string,
  roleData: { role?: AppRole } | null | undefined
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

export interface AuthFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

/** Derive UI permission flags from the resolved staff member role. */
export function deriveAuthFlags(staffMember: Pick<StaffMember, 'appRole'> | null | undefined): AuthFlags {
  const appRole = staffMember?.appRole;
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Google sign-in errors that should fall back to redirect flow. */
export function isGooglePopupFallbackError(code: string | undefined): boolean {
  return code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user';
}

export interface StaffResolutionInput {
  authEmail: string;
  authDisplayName?: string | null;
  staffDoc: StaffMember | null;
  roleData: { role?: AppRole } | null;
}

/**
 * Merge staff record with roles collection and provide a fallback profile
 * when only a role document exists (matches AuthContext behavior).
 */
export function resolveStaffMember(input: StaffResolutionInput): StaffMember | null {
  const { authEmail, authDisplayName, staffDoc, roleData } = input;

  if (staffDoc) {
    const merged: StaffMember = { ...staffDoc };
    if (roleData?.role) {
      merged.appRole = roleData.role;
    }
    return merged;
  }

  if (roleData?.role) {
    return {
      fullName: authDisplayName || 'مستخدم جديد',
      email: authEmail,
      phone: '',
      role: 'موظف',
      appRole: roleData.role,
      specialization: '',
      nationalId: '',
    };
  }

  return null;
}
