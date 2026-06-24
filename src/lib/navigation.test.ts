import { describe, it, expect } from 'vitest';
import {
  filterNavItemsByRole,
  getRoleLabel,
  resolveCurrentRole,
  NavItem,
} from './navigation';

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] },
  { name: 'Students', path: '/students', roles: ['ADMIN', 'TEACHER_LEADER'] },
  { name: 'Classes', path: '/classes', roles: ['ADMIN'] },
  { name: 'Attendance', path: '/attendance', roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] },
];

describe('resolveCurrentRole', () => {
  it('prefers explicit app role', () => {
    expect(resolveCurrentRole('SUPERVISOR', false)).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin is true', () => {
    expect(resolveCurrentRole(undefined, true)).toBe('ADMIN');
  });

  it('defaults to TEACHER', () => {
    expect(resolveCurrentRole(undefined, false)).toBe('TEACHER');
  });
});

describe('filterNavItemsByRole', () => {
  it('shows admin-only routes to admins', () => {
    const visible = filterNavItemsByRole(navItems, 'ADMIN');
    expect(visible.map((item) => item.path)).toContain('/classes');
  });

  it('hides admin-only routes from teachers', () => {
    const visible = filterNavItemsByRole(navItems, 'TEACHER');
    expect(visible.map((item) => item.path)).not.toContain('/classes');
    expect(visible.map((item) => item.path)).toContain('/attendance');
  });

  it('shows student management only to teacher leaders', () => {
    const leaderItems = filterNavItemsByRole(navItems, 'TEACHER_LEADER');
    const teacherItems = filterNavItemsByRole(navItems, 'TEACHER');
    expect(leaderItems.map((item) => item.path)).toContain('/students');
    expect(teacherItems.map((item) => item.path)).not.toContain('/students');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('returns a generic label for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
