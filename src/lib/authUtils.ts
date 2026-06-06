const DEFAULT_EMAIL_DOMAIN = 'ghiabi.com';

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
