/** Firebase Auth error codes that should fall back to redirect-based Google sign-in. */
export const GOOGLE_POPUP_FALLBACK_CODES = ['auth/popup-blocked', 'auth/popup-closed-by-user'] as const;

export function shouldFallbackToGoogleRedirect(errorCode: string | undefined): boolean {
  if (!errorCode) return false;
  return (GOOGLE_POPUP_FALLBACK_CODES as readonly string[]).includes(errorCode);
}