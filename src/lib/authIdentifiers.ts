/** School login domain appended when users sign in with a username instead of email. */
export const GHIABI_EMAIL_DOMAIN = '@ghiabi.com';

/**
 * Normalizes a login or reset identifier: trims whitespace and appends
 * {@link GHIABI_EMAIL_DOMAIN} when the value is not already an email address.
 */
export function normalizeGhiabiEmail(input: string): string {
  const trimmed = input.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}${GHIABI_EMAIL_DOMAIN}`;
}
