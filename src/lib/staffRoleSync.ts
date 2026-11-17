import type { AppRole } from '../types';

/** Payload written to roles/{email} when an admin updates staff appRole (Staff.tsx). */
export function buildRolesCollectionRolePayload(
  role: AppRole,
  updatedAt: Date = new Date()
): { role: AppRole; updatedAt: Date } {
  return { role, updatedAt };
}