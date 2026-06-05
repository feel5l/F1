import { AppRole } from '../types';

export function computeRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

export function canSeeAllClasses(appRole?: AppRole, isAdmin = false): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function filterClassesForUser<T extends { teacherEmail?: string }>(
  classes: T[],
  userEmail: string | undefined,
  appRole?: AppRole,
  isAdmin = false
): T[] {
  if (canSeeAllClasses(appRole, isAdmin)) {
    return classes;
  }
  return classes.filter((c) => c.teacherEmail === userEmail);
}

export const NAV_ITEM_ROLES: ReadonlyArray<{
  path: string;
  roles: readonly AppRole[];
}> = [
  { path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] },
  { path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { path: '/classes', roles: ['ADMIN'] },
  { path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] },
  { path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
  { path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
];

export function resolveEffectiveRole(appRole?: AppRole, isAdmin = false): AppRole | 'TEACHER' {
  if (appRole) return appRole;
  return isAdmin ? 'ADMIN' : 'TEACHER';
}

export function getVisibleNavPaths(appRole?: AppRole, isAdmin = false): string[] {
  const currentRole = resolveEffectiveRole(appRole, isAdmin);
  return NAV_ITEM_ROLES.filter((item) => item.roles.includes(currentRole)).map((item) => item.path);
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
