import { normalizeSchoolEmail } from './schoolEmail';

/** Resolves a password-reset target; null when the identifier is blank after normalization. */
export function resolvePasswordResetEmail(identifier: string): string | null {
  const email = normalizeSchoolEmail(identifier);
  if (!email) return null;
  return email;
}