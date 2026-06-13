import { AppRole, Class, StaffMember } from '../types';

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

export function resolveCurrentRole(appRole?: AppRole, isAdmin = false): AppRole {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export const NAV_ITEMS = [
  { path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] as AppRole[] },
  { path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] as AppRole[] },
  { path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] as AppRole[] },
  { path: '/classes', roles: ['ADMIN'] as AppRole[] },
  { path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] as AppRole[] },
  { path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] as AppRole[] },
  { path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] as AppRole[] },
] as const;

export function getVisibleNavPaths(role: AppRole): string[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => item.path);
}

export function canSeeAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesForTeacher(classes: Class[], teacherEmail: string): Class[] {
  return classes.filter((c) => c.teacherEmail === teacherEmail);
}

export function filterStaffBySearch(staff: StaffMember[], searchTerm: string): StaffMember[] {
  const term = searchTerm.toLowerCase();
  return staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(term) ||
      (member.role || '').toLowerCase().includes(term) ||
      member.nationalId.includes(searchTerm),
  );
}

export function getRoleLabel(role: AppRole | string): string {
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
