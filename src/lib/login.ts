const DEFAULT_LOGIN_DOMAIN = 'ghiabi.com';

/**
 * Normalizes a login identifier: trims whitespace and appends the school
 * domain when the user enters a username instead of a full email.
 */
export function normalizeLoginIdentifier(
  identifier: string,
  domain: string = DEFAULT_LOGIN_DOMAIN
): string {
  const normalized = identifier.trim();
  return normalized.includes('@') ? normalized : `${normalized}@${domain}`;
}
