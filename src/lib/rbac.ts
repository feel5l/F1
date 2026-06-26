import { AppRole } from '../types';

export const NAV_ITEMS = [
  { name: 'لوحة التحكم', path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] as AppRole[] },
  { name: 'إدارة الطلاب', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] as AppRole[] },
  { name: 'الهيئة التعليمية', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] as AppRole[] },
  { name: 'إدارة الفصول', path: '/classes', roles: ['ADMIN'] as AppRole[] },
  { name: 'تحضير اليوم', path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] as AppRole[] },
  { name: 'سجل الغياب', path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] as AppRole[] },
  { name: 'التقارير', path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] as AppRole[] },
] as const;

export function getVisibleNavPaths(appRole: AppRole): string[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(appRole)).map((item) => item.path);
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

export function canSeeAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}
