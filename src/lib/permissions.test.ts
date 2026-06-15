import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  deriveRoleFlags,
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  canSeeAllClasses,
  filterClassesByRole,
  filterNavItemsByRole,
  getRoleLabel,
} from './permissions';
import { StaffMember } from '../types';

describe('deriveRoleFlags', () => {
  it('identifies admin role', () => {
    expect(deriveRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER_LEADER as teacher', () => {
    expect(deriveRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('identifies supervisor role', () => {
    expect(deriveRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });

  it('returns false flags when role is undefined', () => {
    expect(deriveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('shouldBootstrapAdmin', () => {
  it('bootstraps only the designated admin email without an existing role', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('does not bootstrap when role already exists', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, { role: 'TEACHER' })).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdmin('other@gmail.com', null)).toBe(false);
  });
});

describe('mergeStaffWithRole', () => {
  const staffRecord: StaffMember = {
    id: 's1',
    fullName: 'أحمد',
    nationalId: '123',
    phone: '0500000000',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'رياضيات',
    email: 'ahmad@ghiabi.com',
  };

  it('overwrites appRole from roles collection when staff exists', () => {
    const merged = mergeStaffWithRole(staffRecord, { role: 'ADMIN' }, {
      email: 'ahmad@ghiabi.com',
    });
    expect(merged?.appRole).toBe('ADMIN');
    expect(merged?.fullName).toBe('أحمد');
  });

  it('returns staff unchanged when no role override exists', () => {
    expect(mergeStaffWithRole(staffRecord, null, { email: 'ahmad@ghiabi.com' })).toEqual(
      staffRecord
    );
  });

  it('creates fallback staff member from role-only data', () => {
    const merged = mergeStaffWithRole(null, { role: 'SUPERVISOR' }, {
      email: 'super@ghiabi.com',
      displayName: 'مشرف المدرسة',
    });
    expect(merged).toMatchObject({
      fullName: 'مشرف المدرسة',
      email: 'super@ghiabi.com',
      appRole: 'SUPERVISOR',
      role: 'موظف',
    });
  });

  it('returns null when neither staff nor role data exists', () => {
    expect(mergeStaffWithRole(null, null, { email: 'unknown@ghiabi.com' })).toBeNull();
  });
});

describe('canSeeAllClasses', () => {
  it('allows privileged roles and admins to see all classes', () => {
    expect(canSeeAllClasses('ATTENDANCE_OFFICER', false)).toBe(true);
    expect(canSeeAllClasses('TEACHER_LEADER', false)).toBe(true);
    expect(canSeeAllClasses('SUPERVISOR', false)).toBe(true);
    expect(canSeeAllClasses(undefined, true)).toBe(true);
  });

  it('restricts plain teachers', () => {
    expect(canSeeAllClasses('TEACHER', false)).toBe(false);
  });
});

describe('filterClassesByRole', () => {
  const classes = [
    { id: 'c1', name: '1أ', teacherEmail: 't1@ghiabi.com' },
    { id: 'c2', name: '2ب', teacherEmail: 't2@ghiabi.com' },
  ];

  it('returns all classes when seeAll is true', () => {
    expect(filterClassesByRole(classes, 't1@ghiabi.com', true)).toHaveLength(2);
  });

  it('filters to assigned teacher classes only', () => {
    const filtered = filterClassesByRole(classes, 't1@ghiabi.com', false);
    expect(filtered).toEqual([classes[0]]);
  });
});

import { AppRole } from '../types';

describe('filterNavItemsByRole', () => {
  const items: { path: string; roles: AppRole[] }[] = [
    { path: '/', roles: ['ADMIN', 'TEACHER'] },
    { path: '/classes', roles: ['ADMIN'] },
    { path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
  ];

  it('shows only routes allowed for the current role', () => {
    expect(filterNavItemsByRole(items, 'TEACHER').map((i) => i.path)).toEqual(['/']);
    expect(filterNavItemsByRole(items, 'SUPERVISOR').map((i) => i.path)).toEqual([
      '/staff',
    ]);
    expect(filterNavItemsByRole(items, 'ADMIN').map((i) => i.path)).toEqual([
      '/',
      '/classes',
      '/staff',
    ]);
  });
});

describe('getRoleLabel', () => {
  it('maps known roles to Arabic labels', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER')).toBe('معلم');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
