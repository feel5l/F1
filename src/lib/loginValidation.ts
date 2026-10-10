import { normalizeSchoolEmail } from './identifiers';

const EMPTY_RESET_EMAIL_MESSAGE = 'يرجى إدخال البريد الإلكتروني';

/**
 * Validates password-reset input before calling Firebase.
 * Returns an Arabic error message or null when valid.
 */
export function validatePasswordResetEmail(rawEmail: string): string | null {
  if (!rawEmail.trim()) {
    return EMPTY_RESET_EMAIL_MESSAGE;
  }
  return null;
}

/**
 * Normalizes username or email for Firebase password-reset (matches Login flow).
 */
export function resolvePasswordResetEmail(rawEmail: string): string {
  return normalizeSchoolEmail(rawEmail.trim());
}
