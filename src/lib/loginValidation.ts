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
