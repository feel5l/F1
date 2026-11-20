import type { AppRole } from '../types';

export interface StaffRoleBadgeMeta {
  label: string;
  className?: string;
  variant: 'default' | 'outline';
}

/** Label and styling for staff role badges (Staff page). */
export function resolveStaffRoleBadgeMeta(role?: AppRole): StaffRoleBadgeMeta {
  switch (role) {
    case 'ADMIN':
      return { label: 'مدير نظام', className: 'bg-red-100 text-red-800 border-red-200', variant: 'default' };
    case 'TEACHER':
      return { label: 'معلم', className: 'bg-blue-100 text-blue-800 border-blue-200', variant: 'default' };
    case 'TEACHER_LEADER':
      return {
        label: 'رائد نشاط',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        variant: 'default',
      };
    case 'ATTENDANCE_OFFICER':
      return {
        label: 'مسؤول غياب',
        className: 'bg-green-100 text-green-800 border-green-200',
        variant: 'default',
      };
    case 'SUPERVISOR':
      return { label: 'مشرف', className: 'bg-amber-100 text-amber-800 border-amber-200', variant: 'default' };
    default:
      return { label: 'غير محدد', variant: 'outline' };
  }
}