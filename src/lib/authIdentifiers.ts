/** Domain used when staff sign in with a username instead of a full email. */
export const GHIABI_EMAIL_DOMAIN = '@ghiabi.com';

/**
 * Normalizes a login or password-reset identifier to a full email address.
 * Usernames without `@` are suffixed with the school domain.
 */
export function toLoginEmail(identifier: string, domain = GHIABI_EMAIL_DOMAIN): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}${domain}`;
}
