import { AppRole, StaffMember } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';
export const GHIYABI_EMAIL_DOMAIN = '@ghiabi.com';

/** Normalize username-or-email to a full @ghiabi.com address when needed. */
export function normalizeGhiyabiEmail(identifier: string): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}${GHIYABI_EMAIL_DOMAIN}`;
}

export function shouldBootstrapAdmin(email: string): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

export function isGooglePopupFallbackError(error: { code?: string }): boolean {
  return error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user';
}

export function deriveRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

type AuthUserLike = {
  email: string;
  displayName?: string | null;
};

/**
 * Resolve the effective staff member from Firestore staff + roles collections.
 * Mirrors AuthContext merge logic for testability.
 */
export function resolveStaffMember(params: {
  authUser: AuthUserLike;
  staffDoc: StaffMember | null;
  roleData: { role?: AppRole } | null;
}): StaffMember | null {
  const { authUser, staffDoc, roleData } = params;
  const role = roleData?.role;

  if (staffDoc) {
    if (role) {
      return { ...staffDoc, appRole: role };
    }
    return staffDoc;
  }

  if (role) {
    return {
      fullName: authUser.displayName || 'مستخدم جديد',
      email: authUser.email,
      phone: '',
      role: 'موظف',
      appRole: role,
      specialization: '',
      nationalId: '',
    };
  }

  return null;
}
