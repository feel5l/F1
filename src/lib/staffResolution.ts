import type { AppRole, StaffMember } from '../types';

export function overlayRoleOnStaffMember(
  staff: StaffMember,
  roleFromCollection?: AppRole
): StaffMember {
  if (!roleFromCollection) return staff;
  return { ...staff, appRole: roleFromCollection };
}

export function staffMemberFromRoleOnly(
  email: string,
  displayName: string | null | undefined,
  role: AppRole
): StaffMember {
  return {
    fullName: displayName || 'مستخدم جديد',
    email,
    phone: '',
    role: 'موظف',
    appRole: role,
    specialization: '',
    nationalId: '',
  };
}

/**
 * Resolves the signed-in user's staff record from Firestore staff + roles collections.
 */
export function resolveStaffMemberFromAuthData(
  staffFromQuery: StaffMember | null,
  roleFromCollection: AppRole | undefined,
  auth: { email: string; displayName?: string | null }
): StaffMember | null {
  if (staffFromQuery) {
    return overlayRoleOnStaffMember(staffFromQuery, roleFromCollection);
  }
  if (roleFromCollection) {
    return staffMemberFromRoleOnly(auth.email, auth.displayName, roleFromCollection);
  }
  return null;
}