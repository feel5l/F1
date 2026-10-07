/** School login domain for username-only identifiers (e.g. zayd12345). */
export const GHIYABI_LOGIN_DOMAIN = 'ghiabi.com';

/**
 * Normalizes a username or email for Firebase auth.
 * Usernames without `@` are expanded to @{GHIYABI_LOGIN_DOMAIN}.
 */
export function normalizeGhiyabiLoginIdentifier(raw: string): string {
  const normalized = raw.trim();
  if (!normalized) {
    return normalized;
  }
  return normalized.includes('@') ? normalized : `${normalized}@${GHIYABI_LOGIN_DOMAIN}`;
}

export function shouldUseGoogleRedirectOnPopupError(errorCode?: string): boolean {
  return errorCode === 'auth/popup-blocked' || errorCode === 'auth/popup-closed-by-user';
}
