import { AppRole, StaffMember } from '../types';
import { mergeStaffWithRole, createStaffFromRole } from './rbac';

/**
 * Resolves the authenticated user's staff profile from Firestore staff/roles data.
 */
export function resolveStaffMemberFromAuth(
  staffRecord: StaffMember | null,
  roleData: { role?: AppRole } | null,
  email: string,
  displayName?: string | null
): StaffMember | null {
  if (staffRecord) {
    return mergeStaffWithRole(staffRecord, roleData);
  }
  if (roleData?.role) {
    return createStaffFromRole(email, displayName, roleData.role);
  }
  return null;
}
