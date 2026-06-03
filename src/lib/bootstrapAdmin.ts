export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

/** First-time admin role seed for the bootstrap account when no role doc exists yet. */
export function shouldBootstrapAdminRole(
  email: string | null | undefined,
  existingRole: string | null | undefined
): boolean {
  return Boolean(email && email === BOOTSTRAP_ADMIN_EMAIL && !existingRole);
}
