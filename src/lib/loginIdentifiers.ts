/**
 * Normalizes a login or reset identifier: trims whitespace and, if no "@"
 * is present, appends the school domain (username-as-email pattern).
 */
export function resolveGhiabiEmail(identifier: string): string {
  const trimmed = identifier.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}@ghiabi.com`;
}
