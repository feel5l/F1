/** Firebase auth error codes that trigger popup → redirect fallback (merged Google login flow). */
export const GOOGLE_POPUP_FALLBACK_ERROR_CODES = [
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
] as const;

export function shouldFallbackToGoogleRedirect(errorCode: string | undefined | null): boolean {
  if (!errorCode) return false;
  return (GOOGLE_POPUP_FALLBACK_ERROR_CODES as readonly string[]).includes(errorCode);
}