import type { AppRole } from '../types';
import { isRoleAllowedForNav } from './roleAccess';

export interface NavItemDef {
  name: string;
  path: string;
  roles: readonly AppRole[];
}

/** Role allow-lists mirrored from Layout.tsx — used for RBAC regression tests. */
export const LAYOUT_NAV_ITEMS: NavItemDef[] = [
  {
    name: 'لوحة التحكم',
    path: '/',
    roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'],
  },
  { name: 'إدارة الطلاب', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { name: 'الهيئة التعليمية', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'إدارة الفصول', path: '/classes', roles: ['ADMIN'] },
  {
    name: 'تحضير اليوم',
    path: '/attendance',
    roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'],
  },
  { name: 'سجل الغياب', path: '/logs', roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
  { name: 'التقارير', path: '/reports', roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
];

export function visibleNavPathsForRole(currentRole: AppRole | string): string[] {
  return LAYOUT_NAV_ITEMS.filter((item) => isRoleAllowedForNav(currentRole, item.roles)).map(
    (item) => item.path
  );
}