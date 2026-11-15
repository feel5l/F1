import type { AppRole, StaffMember } from '../types';

/** Applies roles/{email} as source of truth over staff.appRole (AuthContext). */
export function mergeStaffWithRoleDoc(
  staff: StaffMember,
  roleData: { role?: string } | null | undefined
): StaffMember {
  const role = roleData?.role as AppRole | undefined;
  if (role) return { ...staff, appRole: role };
  return staff;
}

export function buildStaffFallbackFromRole(
  email: string,
  displayName: string | null | undefined,
  role: AppRole
): StaffMember {
  return {
    fullName: displayName || 'مستخدم جديد',
    email,
    phone: '',
    nationalId: '',
    role: 'موظف',
    appRole: role,
    specialization: '',
  };
}

/**
 * Resolves staff member after auth: staff record wins, with role override;
 * otherwise minimal staff from roles collection only.
 */
export function resolveStaffMemberAfterAuth(
  staffFromCollection: StaffMember | null,
  roleData: { role?: string } | null | undefined,
  authEmail: string,
  displayName: string | null | undefined
): StaffMember | null {
  if (staffFromCollection) {
    return mergeStaffWithRoleDoc(staffFromCollection, roleData);
  }
  const role = roleData?.role as AppRole | undefined;
  if (role) {
    return buildStaffFallbackFromRole(authEmail, displayName, role);
  }
  return null;
}