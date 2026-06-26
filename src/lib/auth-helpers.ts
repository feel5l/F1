import { AppRole, StaffMember } from '../types';

const GHIABI_EMAIL_DOMAIN = '@ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export function normalizeGhiabiEmail(input: string): string {
  const trimmed = input.trim();
  return trimmed.includes('@') ? trimmed : `${trimmed}${GHIABI_EMAIL_DOMAIN}`;
}

export function resolveRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

export function shouldBootstrapAdmin(
  email: string,
  roleData: { role?: AppRole } | null
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

export function mergeStaffWithRole(
  email: string,
  displayName: string | null,
  staffDoc: StaffMember | null,
  roleData: { role?: AppRole } | null
): StaffMember | null {
  if (staffDoc) {
    const merged = { ...staffDoc };
    if (roleData?.role) {
      merged.appRole = roleData.role;
    }
    return merged;
  }

  if (roleData?.role) {
    return {
      fullName: displayName || 'مستخدم جديد',
      email,
      nationalId: '',
      phone: '',
      role: 'موظف',
      appRole: roleData.role,
      specialization: '',
    };
  }

  return null;
}
