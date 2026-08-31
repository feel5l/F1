import { AppRole } from '../types';

export interface NavItem {
  name: string;
  path: string;
  roles: AppRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'لوحة التحكم', path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] },
  { name: 'إدارة الطلاب', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { name: 'الهيئة التعليمية', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'إدارة الفصول', path: '/classes', roles: ['ADMIN'] },
  { name: 'تحضير اليوم', path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] },
  { name: 'سجل الغياب', path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
  { name: 'التقارير', path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
];

/** Resolve the effective role used for navigation when appRole may be unset. */
export function resolveEffectiveRole(appRole?: AppRole, isAdmin = false): AppRole {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

/** Filter navigation items visible to the given role. */
export function filterNavItemsForRole(role: AppRole, items: NavItem[] = NAV_ITEMS): NavItem[] {
  return items.filter((item) => item.roles.includes(role));
}

/** Arabic display label for an app role. */
export function getRoleLabel(role: string): string {
  switch (role) {
    case 'ADMIN': return 'مدير نظام';
    case 'TEACHER': return 'معلم';
    case 'TEACHER_LEADER': return 'رائد نشاط / رئيس قسم';
    case 'ATTENDANCE_OFFICER': return 'مسؤول غياب';
    case 'SUPERVISOR': return 'مشرف';
    default: return 'موظف';
  }
}
