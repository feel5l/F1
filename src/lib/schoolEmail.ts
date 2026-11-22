/** School login domain for username-only identifiers (e.g. zayd12345). */
export const SCHOOL_EMAIL_DOMAIN = 'ghiabi.com';

/**
 * Normalizes a login identifier: trims whitespace and appends @ghiabi.com when no @ is present.
 */
export function normalizeSchoolEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.includes('@') ? trimmed : `${trimmed}@${SCHOOL_EMAIL_DOMAIN}`;
}
