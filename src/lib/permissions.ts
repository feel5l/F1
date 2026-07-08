import { AppRole } from '../types';

/** Roles that can view all classes (not limited to assigned teacherEmail). */
export function canSeeAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ADMIN' ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

const NAV_ROLE_ACCESS: Record<string, AppRole[]> = {
  '/': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'],
  '/students': ['ADMIN', 'TEACHER_LEADER'],
  '/staff': ['ADMIN', 'SUPERVISOR'],
  '/classes': ['ADMIN'],
  '/attendance': ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'],
  '/logs': ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'],
  '/reports': ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'],
};

export function canAccessRoute(path: string, appRole: AppRole): boolean {
  const allowedRoles = NAV_ROLE_ACCESS[path];
  if (!allowedRoles) return false;
  return allowedRoles.includes(appRole);
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
