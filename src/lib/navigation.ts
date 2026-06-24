export type NavRole =
  | 'ADMIN'
  | 'TEACHER'
  | 'TEACHER_LEADER'
  | 'ATTENDANCE_OFFICER'
  | 'SUPERVISOR';

export interface NavItem {
  name: string;
  path: string;
  roles: NavRole[];
}

export function resolveCurrentRole(appRole?: string, isAdmin = false): NavRole {
  if (appRole) {
    return appRole as NavRole;
  }
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export function filterNavItemsByRole<T extends { roles: NavRole[] }>(
  items: T[],
  currentRole: NavRole
): T[] {
  return items.filter((item) => item.roles.includes(currentRole));
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
