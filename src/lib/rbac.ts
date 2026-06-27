import { AppRole, Class, StaffMember } from '../types';

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

/** Navigation role matrix matching Layout.tsx. */
export const LAYOUT_NAV_ITEMS: NavItem[] = [
  { name: 'لوحة التحكم', path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] },
  { name: 'إدارة الطلاب', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { name: 'الهيئة التعليمية', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'إدارة الفصول', path: '/classes', roles: ['ADMIN'] },
  { name: 'تحضير اليوم', path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] },
  { name: 'سجل الغياب', path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
  { name: 'التقارير', path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
];

/**
 * Resolves the effective app role for navigation (matches Layout fallback logic).
 */
export function resolveCurrentRole(appRole?: AppRole, isAdmin = false): AppRole {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
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

/**
 * Filters classes visible on the reports page (admin sees all, others see assigned classes).
 */
export function filterClassesForReports(
  classes: Class[],
  isAdmin: boolean,
  userEmail?: string | null
): Class[] {
  if (isAdmin) return classes;
  if (!userEmail) return [];
  return classes.filter((c) => c.teacherEmail === userEmail);
}

/**
 * Filters classes visible on the attendance page based on role.
 */
export function filterClassesForAttendance(
  classes: Class[],
  appRole: AppRole | undefined,
  isAdmin: boolean,
  userEmail?: string | null
): Class[] {
  const canSeeAll =
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR';

  if (canSeeAll) return classes;
  if (!userEmail) return [];
  return classes.filter((c) => c.teacherEmail === userEmail);
}
