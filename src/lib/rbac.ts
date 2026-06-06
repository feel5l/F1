import { AppRole, StaffMember } from '../types';

export const ADMIN_BOOTSTRAP_EMAIL = 'alzaem3000@gmail.com';

export interface NavItem {
  name: string;
  path: string;
  roles: AppRole[];
}

export interface RoleFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

/**
 * Derives permission flags from an app role.
 */
export function resolveRoleFlags(appRole?: AppRole | null): RoleFlags {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/**
 * Returns human-readable Arabic label for a role.
 */
export function getRoleLabel(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'مدير نظام';
    case 'TEACHER':
      return 'معلم';
    case 'TEACHER_LEADER':
      return 'رائد نشاط / رئيس قسم';
    case 'ATTENDANCE_OFFICER':
      return 'مسؤول غياب';
    case 'SUPERVISOR':
      return 'مشرف';
    default:
      return 'موظف';
  }
}

/**
 * Filters navigation items visible to the given role.
 */
export function filterNavItemsByRole<T extends NavItem>(
  items: T[],
  currentRole: AppRole
): T[] {
  return items.filter((item) => item.roles.includes(currentRole));
}

/**
 * Whether the bootstrap admin should receive an ADMIN role document.
 */
export function shouldBootstrapAdmin(
  email: string,
  existingRole?: { role?: AppRole } | null
): boolean {
  return !existingRole?.role && email === ADMIN_BOOTSTRAP_EMAIL;
}

/**
 * Merges staff record with roles collection data (roles take precedence).
 */
export function mergeStaffWithRole(
  staff: StaffMember,
  roleData?: { role?: AppRole } | null
): StaffMember {
  if (roleData?.role) {
    return { ...staff, appRole: roleData.role };
  }
  return staff;
}

/**
 * Creates a fallback staff member when only roles collection has data.
 */
export function createStaffFromRole(
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
