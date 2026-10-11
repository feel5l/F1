import { AppRole, StaffMember } from '../types';

export interface RoleDocument {
  role?: AppRole;
}

/**
 * Overlays the roles collection value onto a staff document when present.
 */
export function applyRoleToStaffMember(
  staff: StaffMember,
  roleData: RoleDocument | null
): StaffMember {
  if (roleData?.role) {
    return { ...staff, appRole: roleData.role };
  }
  return staff;
}

/**
 * Fallback staff profile when the user exists in roles but not yet in staff.
 */
export function buildStaffMemberFromRoleOnly(
  authEmail: string,
  displayName: string | null | undefined,
  roleData: RoleDocument | null
): StaffMember | null {
  if (!roleData?.role) return null;

  return {
    fullName: displayName || 'مستخدم جديد',
    email: authEmail,
    phone: '',
    nationalId: '',
    role: 'موظف',
    appRole: roleData.role,
    specialization: '',
  };
}

/**
 * Resolves the in-memory staff member after staff + roles queries (AuthContext).
 */
export function resolveStaffMemberFromQueries(
  staffDoc: StaffMember | null,
  authEmail: string,
  displayName: string | null | undefined,
  roleData: RoleDocument | null
): StaffMember | null {
  if (staffDoc) {
    return applyRoleToStaffMember(staffDoc, roleData);
  }
  return buildStaffMemberFromRoleOnly(authEmail, displayName, roleData);
}
