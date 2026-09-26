import { AppRole } from '../types';

/**
 * Payload for updating a staff member's appRole in Firestore.
 */
export function buildStaffRoleUpdate(newRole: AppRole) {
  return { appRole: newRole };
}

/**
 * Payload for syncing the global roles collection (used by Firestore rules).
 */
export function buildRolesCollectionUpdate(
  newRole: AppRole,
  updatedAt: Date = new Date()
) {
  return { role: newRole, updatedAt };
}

/**
 * Returns true when a role update can proceed.
 */
export function canUpdateStaffRole(
  memberEmail: string | undefined,
  newRole: AppRole | ''
): boolean {
  return Boolean(memberEmail && newRole);
}
