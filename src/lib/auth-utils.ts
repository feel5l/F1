export const SCHOOL_EMAIL_DOMAIN = 'ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

/** Converts a username or email into a full school login email. */
export function normalizeSchoolEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (!trimmed) return trimmed;
  return trimmed.includes('@') ? trimmed : `${trimmed}@${SCHOOL_EMAIL_DOMAIN}`;
}

/** Whether this email should auto-receive ADMIN role on first sign-in. */
export function isBootstrapAdminEmail(email: string): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}
