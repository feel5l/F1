import { AppRole } from '../types';

/** Email allowed to self-bootstrap ADMIN role on first sign-in. */
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export interface AuthFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

/**
 * Derives UI permission flags from the user's structured app role.
 * Admin is determined solely by roles collection — not hardcoded emails.
 */
export function deriveAuthFlags(appRole?: AppRole | null): AuthFlags {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/**
 * Returns true when the bootstrap admin should receive an ADMIN role document.
 */
export function shouldBootstrapAdminRole(
  email: string | null | undefined,
  existingRole: AppRole | string | null | undefined
): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL && !existingRole;
}

/**
 * Returns true when Google sign-in should fall back to redirect after popup failure.
 */
export function shouldFallbackToGoogleRedirect(errorCode: string | undefined): boolean {
  return errorCode === 'auth/popup-blocked' || errorCode === 'auth/popup-closed-by-user';
}
