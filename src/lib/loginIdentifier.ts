const DEFAULT_LOGIN_DOMAIN = '@ghiabi.com';

/** Normalize username-or-email input to a full email for Firebase auth. */
export function normalizeLoginIdentifier(
  identifier: string,
  domain: string = DEFAULT_LOGIN_DOMAIN
): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}${domain}`;
}

/** Whether Google sign-in should fall back to redirect after a popup failure. */
export function shouldFallbackToGoogleRedirect(errorCode: string | undefined): boolean {
  return errorCode === 'auth/popup-blocked' || errorCode === 'auth/popup-closed-by-user';
}
