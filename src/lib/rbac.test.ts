import { describe, it, expect } from 'vitest';
import {
  resolveRoleFlags,
  getRoleLabel,
  filterNavItemsByRole,
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  createStaffFromRole,
  filterClassesForReports,
  filterClassesForAttendance,
  filterStaffBySearch,
  buildRoleSyncPayload,
  buildBootstrapAdminRolePayload,
  shouldScopeLogsToTeacher,
  resolveTeacherEmailFilter,
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

describe('filterStaffBySearch', () => {
  const staff: StaffMember[] = [
    {
      fullName: 'أحمد محمد',
      nationalId: '1234567890',
      phone: '050',
      role: 'معلم',
      appRole: 'TEACHER',
      specialization: 'رياضيات',
      email: 'a@ghiabi.com',
    },
    {
      fullName: 'سارة علي',
      nationalId: '9876543210',
      phone: '051',
      role: 'مشرف',
      appRole: 'SUPERVISOR',
      specialization: '',
      email: 's@ghiabi.com',
    },
  ];

  it('matches by full name (case-insensitive)', () => {
    expect(filterStaffBySearch(staff, 'أحمد').map((m) => m.email)).toEqual(['a@ghiabi.com']);
    expect(filterStaffBySearch(staff, 'سارة').map((m) => m.email)).toEqual(['s@ghiabi.com']);
  });

  it('matches by role label', () => {
    expect(filterStaffBySearch(staff, 'مشرف').map((m) => m.email)).toEqual(['s@ghiabi.com']);
  });

  it('matches by national ID', () => {
    expect(filterStaffBySearch(staff, '1234567890').map((m) => m.email)).toEqual(['a@ghiabi.com']);
  });

  it('returns all staff for empty search', () => {
    expect(filterStaffBySearch(staff, '')).toHaveLength(2);
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

describe('resolveTeacherEmailFilter', () => {
  it('returns null for admins', () => {
    expect(resolveTeacherEmailFilter(true, 'teacher@ghiabi.com')).toBeNull();
  });

  it('returns teacher email for non-admins with email', () => {
    expect(resolveTeacherEmailFilter(false, 'teacher@ghiabi.com')).toBe(
      'teacher@ghiabi.com',
    );
  });

  it('returns null for non-admins without email', () => {
    expect(resolveTeacherEmailFilter(false, null)).toBeNull();
    expect(resolveTeacherEmailFilter(false, undefined)).toBeNull();
    expect(resolveTeacherEmailFilter(false, '')).toBeNull();
  });
});

describe('buildRoleSyncPayload', () => {
  it('includes role and updatedAt for roles collection sync', () => {
    const updatedAt = new Date('2026-07-14T10:00:00Z');
    expect(buildRoleSyncPayload('TEACHER_LEADER', updatedAt)).toEqual({
      role: 'TEACHER_LEADER',
      updatedAt,
    });
  });
});
