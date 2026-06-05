import { AppRole, StaffMember } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export function shouldBootstrapAdminRole(
  email: string,
  roleData: { role?: AppRole } | null
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

interface AuthUserLike {
  email: string;
  displayName?: string | null;
}

/** Merge staff record with roles collection; fallback when only roles exist. */
export function resolveStaffMemberFromAuth(
  authUser: AuthUserLike,
  staffDoc: StaffMember | null,
  roleData: { role?: AppRole } | null
): StaffMember | null {
  if (staffDoc) {
    const data = { ...staffDoc };
    if (roleData?.role) {
      data.appRole = roleData.role;
    }
    return data;
  }

  if (roleData?.role) {
    return {
      fullName: authUser.displayName || 'مستخدم جديد',
      email: authUser.email,
      phone: '',
      role: 'موظف',
      appRole: roleData.role,
      specialization: '',
      nationalId: '',
    };
  }

  return null;
}
