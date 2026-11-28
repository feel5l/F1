import type { AppRole } from '../types';

/** Guards staff role updates (member id and target role must be set). */
export function canUpdateStaffRole(
  member: { id?: string } | null | undefined,
  role: AppRole | '' | null | undefined
): boolean {
  return Boolean(member?.id && role);
}