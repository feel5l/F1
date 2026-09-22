const DEFAULT_SCHOOL_EMAIL_DOMAIN = 'ghiabi.com';

/**
 * Normalizes a username or email into a full school email address.
 * Used for login and password-reset flows.
 */
export function normalizeSchoolEmail(
  input: string,
  domain: string = DEFAULT_SCHOOL_EMAIL_DOMAIN
): string {
  const trimmed = input.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}@${domain}`;
}
