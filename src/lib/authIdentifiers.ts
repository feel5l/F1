/** School domain appended when staff sign in with username only (no @). */
export const GHIYABI_EMAIL_DOMAIN = '@ghiabi.com';

/**
 * Normalizes login/reset input: trims whitespace and appends school domain for bare usernames.
 */
export function normalizeGhiyabiIdentifier(
  input: string,
  domain: string = GHIYABI_EMAIL_DOMAIN
): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  return trimmed.includes('@') ? trimmed : `${trimmed}${domain}`;
}
