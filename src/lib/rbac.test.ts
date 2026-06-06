import { describe, it, expect } from 'vitest';
import {
  resolveRoleFlags,
  getRoleLabel,
  filterNavItemsByRole,
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  createStaffFromRole,
  ADMIN_BOOTSTRAP_EMAIL,
} from './rbac';
import { AppRole, StaffMember } from '../types';

const sampleNav = [
  { name: 'Dashboard', path: '/', roles: ['ADMIN', 'TEACHER'] as AppRole[] },
  { name: 'Staff', path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] as AppRole[] },
  { name: 'Classes', path: '/classes', roles: ['ADMIN'] as AppRole[] },
];

describe('resolveRoleFlags', () => {
  it('identifies admin', () => {
    expect(resolveRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher', () => {
    expect(resolveRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('returns all false for undefined role', () => {
    expect(resolveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('falls back for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});

describe('filterNavItemsByRole', () => {
  it('shows only items allowed for TEACHER', () => {
    const visible = filterNavItemsByRole(sampleNav, 'TEACHER');
    expect(visible.map((i) => i.path)).toEqual(['/']);
  });

  it('shows admin-only routes for ADMIN', () => {
    const visible = filterNavItemsByRole(sampleNav, 'ADMIN');
    expect(visible.map((i) => i.path)).toEqual(['/', '/staff', '/classes']);
  });

  it('shows supervisor staff page but not classes', () => {
    const visible = filterNavItemsByRole(sampleNav, 'SUPERVISOR');
    expect(visible.map((i) => i.path)).toEqual(['/staff']);
  });
});

describe('shouldBootstrapAdmin', () => {
  it('bootstraps only the designated admin email without existing role', () => {
    expect(shouldBootstrapAdmin(ADMIN_BOOTSTRAP_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdmin(ADMIN_BOOTSTRAP_EMAIL, {})).toBe(true);
  });

  it('does not bootstrap when role already exists', () => {
    expect(shouldBootstrapAdmin(ADMIN_BOOTSTRAP_EMAIL, { role: 'ADMIN' })).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdmin('other@gmail.com', null)).toBe(false);
  });
});

describe('mergeStaffWithRole', () => {
  const baseStaff: StaffMember = {
    fullName: 'Test',
    nationalId: '123',
    phone: '050',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'Math',
    email: 't@ghiabi.com',
  };

  it('overwrites appRole from roles collection', () => {
    const merged = mergeStaffWithRole(baseStaff, { role: 'ADMIN' });
    expect(merged.appRole).toBe('ADMIN');
    expect(merged.fullName).toBe('Test');
  });

  it('returns staff unchanged when no role data', () => {
    expect(mergeStaffWithRole(baseStaff, null)).toEqual(baseStaff);
  });
});

describe('createStaffFromRole', () => {
  it('creates fallback staff with display name', () => {
    const staff = createStaffFromRole('new@ghiabi.com', 'New User', 'TEACHER');
    expect(staff).toMatchObject({
      fullName: 'New User',
      email: 'new@ghiabi.com',
      appRole: 'TEACHER',
    });
  });

  it('uses default name when display name is missing', () => {
    const staff = createStaffFromRole('new@ghiabi.com', null, 'SUPERVISOR');
    expect(staff.fullName).toBe('مستخدم جديد');
  });
});
