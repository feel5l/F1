import { AppRole, Class } from '../types';

const ALL_CLASSES_ROLES: AppRole[] = [
  'ATTENDANCE_OFFICER',
  'TEACHER_LEADER',
  'SUPERVISOR',
];

export function canViewAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return isAdmin || (appRole != null && ALL_CLASSES_ROLES.includes(appRole));
}

export function filterClassesByRole(
  classes: Class[],
  options: { isAdmin: boolean; appRole?: AppRole; userEmail?: string | null }
): Class[] {
  if (canViewAllClasses(options.isAdmin, options.appRole)) {
    return classes;
  }
  return classes.filter((c) => c.teacherEmail === options.userEmail);
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

export interface NavItem {
  name: string;
  path: string;
  roles: readonly AppRole[];
}

export function filterNavItemsByRole<T extends NavItem>(
  navItems: readonly T[],
  currentRole: AppRole
): T[] {
  return navItems.filter((item) => item.roles.includes(currentRole));
}
