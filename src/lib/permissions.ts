import { AppRole, StaffMember } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export interface RoleFlags {
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

export function deriveRoleFlags(appRole?: AppRole): RoleFlags {
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
  staffData: StaffMember | null,
  roleData: { role?: AppRole } | null,
  authUser: { email: string; displayName?: string | null }
): StaffMember | null {
  if (staffData) {
    if (roleData?.role) {
      return { ...staffData, appRole: roleData.role };
    }
    return staffData;
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

export function canSeeAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesByRole<T extends { teacherEmail?: string }>(
  classes: T[],
  userEmail: string | undefined,
  seeAll: boolean
): T[] {
  if (seeAll) return classes;
  return classes.filter((c) => c.teacherEmail === userEmail);
}

export interface NavItem {
  path: string;
  roles: readonly AppRole[];
}

export function filterNavItemsByRole<T extends NavItem>(
  items: T[],
  currentRole: AppRole | string
): T[] {
  return items.filter((item) =>
    (item.roles as readonly string[]).includes(currentRole)
  );
}

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
