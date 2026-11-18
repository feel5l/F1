export { normalizeSchoolEmail, SCHOOL_EMAIL_DOMAIN } from './schoolEmail';

const GOOGLE_REDIRECT_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
]);

/** Whether Google sign-in should fall back from popup to redirect. */
export function shouldFallbackToGoogleRedirect(errorCode: string | undefined): boolean {
  return errorCode !== undefined && GOOGLE_REDIRECT_FALLBACK_CODES.has(errorCode);
}
