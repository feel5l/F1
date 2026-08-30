import { AppRole } from '../types';

export const SCHOOL_EMAIL_DOMAIN = 'ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

/** Normalize username or email to a full school email address. */
export function normalizeSchoolEmail(identifier: string): string {
  const trimmed = identifier.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}@${SCHOOL_EMAIL_DOMAIN}`;
}

export interface RoleFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

/** Derive role flags from a staff member's appRole. */
export function deriveRoleFlags(appRole?: AppRole): RoleFlags {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Whether the email is the bootstrap admin that can self-assign ADMIN role. */
export function isBootstrapAdminEmail(email: string): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

const GOOGLE_POPUP_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
]);

/** Whether Google sign-in should fall back to redirect after a popup failure. */
export function shouldFallbackToGoogleRedirect(errorCode: string | undefined): boolean {
  return errorCode != null && GOOGLE_POPUP_FALLBACK_CODES.has(errorCode);
}
