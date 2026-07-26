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
 * Payload for bootstrap admin role creation.
 * Must match Firestore rules: keys().hasOnly(['role']) && role == 'ADMIN'.
 */
export function buildBootstrapAdminRolePayload(): { role: 'ADMIN' } {
  return { role: 'ADMIN' };
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

/**
 * Filters staff list by name, role label, or national ID.
 */
/**
 * Builds the roles-collection payload kept in sync with staff appRole updates.
 */
export function buildRoleSyncPayload(
  role: AppRole,
  updatedAt: Date = new Date(),
): { role: AppRole; updatedAt: Date } {
  return { role, updatedAt };
}

/**
 * Whether attendance logs should be scoped to the current teacher (Logs page).
 * Non-admins always scope, even when email is missing.
 */
export function shouldScopeLogsToTeacher(isAdmin: boolean): boolean {
  return !isAdmin;
}

/**
 * Resolves teacherEmail filter for dashboard/reports queries.
 * Returns null when the caller should not add a teacherEmail constraint.
 */
export function resolveTeacherEmailFilter(
  isAdmin: boolean,
  userEmail?: string | null,
): string | null {
  if (isAdmin || !userEmail) return null;
  return userEmail;
}

export function filterStaffBySearch(
  staff: StaffMember[],
  searchTerm: string,
): StaffMember[] {
  const normalizedSearch = searchTerm.toLowerCase();

  return staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(normalizedSearch) ||
      (member.role || '').toLowerCase().includes(normalizedSearch) ||
      member.nationalId.includes(searchTerm),
  );
}
