import { describe, expect, it } from 'vitest';
import type { StaffMember } from '../types';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  canViewAllClasses,
  getRoleFlags,
  resolveStaffMemberForSession,
  shouldBootstrapAdminRole,
} from './roleAccess';

describe('shouldBootstrapAdminRole', () => {
  it('allows bootstrap only for configured admin email without existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('denies bootstrap when role already exists or email differs', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
    expect(shouldBootstrapAdminRole('other@example.com', null)).toBe(false);
  });
});

describe('getRoleFlags', () => {
  it('maps app roles to UI permission flags', () => {
    expect(getRoleFlags('ADMIN')).toEqual({ isAdmin: true, isTeacher: false, isSupervisor: false });
    expect(getRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
    expect(getRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });
});

describe('canViewAllClasses', () => {
  it('grants all-classes view to admin and elevated roles', () => {
    expect(canViewAllClasses(true, undefined)).toBe(true);
    expect(canViewAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canViewAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('restricts plain teachers to their own classes', () => {
    expect(canViewAllClasses(false, 'TEACHER')).toBe(false);
    expect(canViewAllClasses(false, undefined)).toBe(false);
  });
});

describe('resolveStaffMemberForSession', () => {
  const baseStaff: StaffMember = {
    id: 's1',
    fullName: 'Staff One',
    nationalId: '1',
    phone: '050',
    role: 'معلم',
    email: 'teacher@ghiabi.com',
    specialization: 'math',
    appRole: 'TEACHER',
  };

  it('overlays roles collection onto staff record', () => {
    const result = resolveStaffMemberForSession({
      staffFromQuery: baseStaff,
      roleData: { role: 'ADMIN' },
      authEmail: 'teacher@ghiabi.com',
    });
    expect(result?.appRole).toBe('ADMIN');
    expect(result?.fullName).toBe('Staff One');
  });

  it('builds fallback staff when only roles document exists', () => {
    const result = resolveStaffMemberForSession({
      staffFromQuery: null,
      roleData: { role: 'SUPERVISOR' },
      authEmail: 'super@ghiabi.com',
      displayName: 'Supervisor',
    });
    expect(result).toMatchObject({
      email: 'super@ghiabi.com',
      fullName: 'Supervisor',
      appRole: 'SUPERVISOR',
      role: 'موظف',
    });
  });

  it('returns null when neither staff nor role is present', () => {
    expect(
      resolveStaffMemberForSession({
        staffFromQuery: null,
        roleData: null,
        authEmail: 'x@ghiabi.com',
      })
    ).toBeNull();
  });
});
