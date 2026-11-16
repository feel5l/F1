import type { AppRole } from '../types';

export const APP_ROLES: readonly AppRole[] = [
  'ADMIN',
  'TEACHER',
  'TEACHER_LEADER',
  'ATTENDANCE_OFFICER',
  'SUPERVISOR',
];

/** Whitelist parse for roles/{email}.role — ignores unknown or spoofed values. */
export function parseAppRole(raw: string | null | undefined): AppRole | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  return APP_ROLES.includes(trimmed as AppRole) ? (trimmed as AppRole) : undefined;
}