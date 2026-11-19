import type { AppRole } from '../types';

const VALID_APP_ROLES: readonly AppRole[] = [
  'ADMIN',
  'TEACHER',
  'TEACHER_LEADER',
  'ATTENDANCE_OFFICER',
  'SUPERVISOR',
];

const ROLE_LOOKUP = new Set<string>(VALID_APP_ROLES);

/** Parses Firestore roles/{email}.role; rejects unknown or blank values. */
export function parseAppRole(raw: string | undefined | null): AppRole | undefined {
  const role = raw?.trim();
  if (!role || !ROLE_LOOKUP.has(role)) return undefined;
  return role as AppRole;
}