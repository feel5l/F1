import { describe, it, expect } from 'vitest';
import {
  resolveRoleFlags,
  shouldBootstrapAdmin,
  buildBootstrapAdminRolePayload,
  mergeStaffWithRole,
  createStaffFromRole,
  shouldScopeLogsToTeacher,
  ADMIN_BOOTSTRAP_EMAIL,
} from './rbac';
import { StaffMember } from '../types';

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

describe('buildBootstrapAdminRolePayload', () => {
  it('matches Firestore bootstrap create constraints', () => {
    const payload = buildBootstrapAdminRolePayload();

    expect(payload).toEqual({ role: 'ADMIN' });
    expect(Object.keys(payload)).toEqual(['role']);
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

describe('shouldScopeLogsToTeacher', () => {
  it('scopes logs for non-admin teachers', () => {
    expect(shouldScopeLogsToTeacher(false)).toBe(true);
  });

  it('does not scope logs for admins', () => {
    expect(shouldScopeLogsToTeacher(true)).toBe(false);
  });
});
