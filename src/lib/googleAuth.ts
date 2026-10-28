const GOOGLE_REDIRECT_FALLBACK_ERROR_CODES = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
]);

/** When popup sign-in fails, Firebase redirect is used instead. */
export function shouldFallbackToGoogleRedirect(error: unknown): boolean {
  const code = (error as { code?: string } | null | undefined)?.code;
  return typeof code === 'string' && GOOGLE_REDIRECT_FALLBACK_ERROR_CODES.has(code);
}
