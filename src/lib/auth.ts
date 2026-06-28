import { AppRole, Class, StaffMember } from '../types';

export const GHIABI_EMAIL_DOMAIN = 'ghiabi.com';
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export const GOOGLE_POPUP_FALLBACK_ERRORS = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
]);

export const NAV_ITEMS = [
  { name: 'لوحة التحكم', path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] as AppRole[] },
  { name: 'إدارة الطلاب', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] as AppRole[] },
  { name: 'الهيئة التعليمية', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] as AppRole[] },
  { name: 'إدارة الفصول', path: '/classes', roles: ['ADMIN'] as AppRole[] },
  { name: 'تحضير اليوم', path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] as AppRole[] },
  { name: 'سجل الغياب', path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] as AppRole[] },
  { name: 'التقارير', path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] as AppRole[] },
] as const;

/** Normalize username-only logins to the school email domain. */
export function normalizeLoginIdentifier(
  input: string,
  domain: string = GHIABI_EMAIL_DOMAIN,
): string {
  const normalized = input.trim();
  return normalized.includes('@') ? normalized : `${normalized}@${domain}`;
}

export function isBootstrapAdminEmail(email: string): boolean {
  return email === BOOTSTRAP_ADMIN_EMAIL;
}

/** Whether the client should seed the bootstrap admin role document. */
export function shouldBootstrapAdminRole(email: string, existingRole?: string | null): boolean {
  return isBootstrapAdminEmail(email) && !existingRole;
}

/** Whether Google sign-in should fall back to redirect after a popup failure. */
export function shouldFallbackToGoogleRedirect(errorCode?: string): boolean {
  return !!errorCode && GOOGLE_POPUP_FALLBACK_ERRORS.has(errorCode);
}

export function getRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

export function getEffectiveRole(
  staffMember?: Pick<StaffMember, 'appRole'> | null,
  isAdmin = false,
): AppRole | 'TEACHER' {
  return staffMember?.appRole || (isAdmin ? 'ADMIN' : 'TEACHER');
}

export function canSeeAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesForUser(
  classes: Class[],
  options: { isAdmin: boolean; appRole?: AppRole; userEmail?: string | null },
): Class[] {
  if (canSeeAllClasses(options.isAdmin, options.appRole)) {
    return classes;
  }

  return classes.filter((classItem) => classItem.teacherEmail === options.userEmail);
}

export function getVisibleNavPaths(appRole: AppRole | 'TEACHER'): string[] {
  return NAV_ITEMS
    .filter((item) => item.roles.includes(appRole as AppRole))
    .map((item) => item.path);
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

export function filterStaffBySearch(staff: StaffMember[], searchTerm: string): StaffMember[] {
  const normalizedSearch = searchTerm.toLowerCase();

  return staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(normalizedSearch) ||
      (member.role || '').toLowerCase().includes(normalizedSearch) ||
      member.nationalId.includes(searchTerm),
  );
}
