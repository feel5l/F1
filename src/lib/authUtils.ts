const DEFAULT_EMAIL_DOMAIN = 'ghiabi.com';

export const GOOGLE_POPUP_FALLBACK_CODES = [
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
] as const;

/**
 * Normalizes a login identifier (username or email) into a full email address.
 * Trims whitespace and appends @ghiabi.com when no @ is present.
 */
export function normalizeLoginIdentifier(identifier: string): string {
  const normalized = identifier.trim();
  if (!normalized) return normalized;
  return normalized.includes('@')
    ? normalized
    : `${normalized}@${DEFAULT_EMAIL_DOMAIN}`;
}

/**
 * Whether a Google sign-in popup error should fall back to redirect flow.
 */
export function shouldFallbackToGoogleRedirect(errorCode?: string): boolean {
  return GOOGLE_POPUP_FALLBACK_CODES.includes(
    errorCode as (typeof GOOGLE_POPUP_FALLBACK_CODES)[number]
  );
}
