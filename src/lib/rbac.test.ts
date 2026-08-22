import { describe, it, expect } from 'vitest';
import {
  resolveRoleFlags,
  getRoleLabel,
  filterNavItemsByRole,
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  createStaffFromRole,
  applyAdminBootstrap,
  resolveStaffMemberFromAuth,
  resolveNavRole,
  filterClassesForReports,
  filterClassesForAttendance,
  ADMIN_BOOTSTRAP_EMAIL,
} from './rbac';
import { AppRole, Class, StaffMember } from '../types';

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

  it('identifies supervisor without teacher privileges', () => {
    expect(resolveRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
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

describe('applyAdminBootstrap', () => {
  it('returns ADMIN role for bootstrap email without existing role', () => {
    expect(applyAdminBootstrap(ADMIN_BOOTSTRAP_EMAIL, null)).toEqual({ role: 'ADMIN' });
  });

  it('preserves existing role data for non-bootstrap users', () => {
    const roleData = { role: 'TEACHER' as AppRole };
    expect(applyAdminBootstrap('teacher@ghiabi.com', roleData)).toBe(roleData);
  });

  it('does not override an existing admin role document', () => {
    const roleData = { role: 'ADMIN' as AppRole };
    expect(applyAdminBootstrap(ADMIN_BOOTSTRAP_EMAIL, roleData)).toBe(roleData);
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

describe('resolveStaffMemberFromAuth', () => {
  const staffRecord: StaffMember = {
    id: 's1',
    fullName: 'Existing Staff',
    nationalId: '123',
    phone: '050',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'Math',
    email: 'teacher@ghiabi.com',
  };

  it('merges staff record with roles collection data', () => {
    const resolved = resolveStaffMemberFromAuth({
      staffRecord,
      roleData: { role: 'ADMIN' },
      email: 'teacher@ghiabi.com',
      displayName: 'Teacher',
    });
    expect(resolved?.appRole).toBe('ADMIN');
    expect(resolved?.fullName).toBe('Existing Staff');
  });

  it('creates fallback staff when only roles collection has data (Google login)', () => {
    const resolved = resolveStaffMemberFromAuth({
      staffRecord: null,
      roleData: { role: 'ADMIN' },
      email: ADMIN_BOOTSTRAP_EMAIL,
      displayName: 'Admin User',
    });
    expect(resolved).toMatchObject({
      fullName: 'Admin User',
      email: ADMIN_BOOTSTRAP_EMAIL,
      appRole: 'ADMIN',
    });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(
      resolveStaffMemberFromAuth({
        staffRecord: null,
        roleData: null,
        email: 'unknown@ghiabi.com',
        displayName: null,
      })
    ).toBeNull();
  });
});

describe('resolveNavRole', () => {
  it('uses staff appRole when present', () => {
    expect(resolveNavRole('SUPERVISOR', false)).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin flag is set', () => {
    expect(resolveNavRole(undefined, true)).toBe('ADMIN');
  });

  it('defaults to TEACHER when no role and not admin', () => {
    expect(resolveNavRole(undefined, false)).toBe('TEACHER');
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

const sampleClasses: Class[] = [
  { id: 'c1', name: '1أ', gradeLevel: '1', teacherEmail: 'teacher@ghiabi.com' },
  { id: 'c2', name: '2ب', gradeLevel: '2', teacherEmail: 'other@ghiabi.com' },
];

describe('filterClassesForReports', () => {
  it('returns all classes for admin', () => {
    expect(filterClassesForReports(sampleClasses, true, 'admin@ghiabi.com')).toEqual(sampleClasses);
  });

  it('filters to teacher-assigned classes for non-admin', () => {
    const filtered = filterClassesForReports(sampleClasses, false, 'teacher@ghiabi.com');
    expect(filtered.map((c) => c.id)).toEqual(['c1']);
  });

  it('returns empty list when non-admin has no email', () => {
    expect(filterClassesForReports(sampleClasses, false, null)).toEqual([]);
  });
});

describe('filterClassesForAttendance', () => {
  it('returns all classes for admin regardless of app role', () => {
    expect(
      filterClassesForAttendance(sampleClasses, 'TEACHER', true, 'teacher@ghiabi.com')
    ).toEqual(sampleClasses);
  });

  it('returns all classes for attendance officer', () => {
    expect(
      filterClassesForAttendance(sampleClasses, 'ATTENDANCE_OFFICER', false, 'officer@ghiabi.com')
    ).toEqual(sampleClasses);
  });

  it('returns all classes for teacher leader and supervisor', () => {
    expect(
      filterClassesForAttendance(sampleClasses, 'TEACHER_LEADER', false, 'leader@ghiabi.com')
    ).toEqual(sampleClasses);
    expect(
      filterClassesForAttendance(sampleClasses, 'SUPERVISOR', false, 'super@ghiabi.com')
    ).toEqual(sampleClasses);
  });

  it('filters to assigned classes for plain teacher', () => {
    const filtered = filterClassesForAttendance(sampleClasses, 'TEACHER', false, 'teacher@ghiabi.com');
    expect(filtered.map((c) => c.id)).toEqual(['c1']);
  });
});
