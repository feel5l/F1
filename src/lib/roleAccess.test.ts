import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  canViewAllClasses,
  deriveAuthRoleFlags,
  getRoleLabel,
  isRoleAllowedForNav,
  resolveEffectiveRole,
  shouldBootstrapAdminRole,
} from './roleAccess';

describe('deriveAuthRoleFlags', () => {
  it('marks TEACHER_LEADER as teacher but not admin', () => {
    expect(deriveAuthRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('marks SUPERVISOR only as supervisor', () => {
    expect(deriveAuthRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });
});

describe('canViewAllClasses', () => {
  it('allows admin and attendance officer', () => {
    expect(canViewAllClasses(true, undefined)).toBe(true);
    expect(canViewAllClasses(false, 'ATTENDANCE_OFFICER')).toBe(true);
  });

  it('allows teacher leader and supervisor to see all classes', () => {
    expect(canViewAllClasses(false, 'TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses(false, 'SUPERVISOR')).toBe(true);
  });

  it('denies plain teachers', () => {
    expect(canViewAllClasses(false, 'TEACHER')).toBe(false);
  });
});

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('resolveEffectiveRole', () => {
  it('falls back to TEACHER when no staff role', () => {
    expect(resolveEffectiveRole(undefined, false)).toBe('TEACHER');
    expect(resolveEffectiveRole(undefined, true)).toBe('ADMIN');
  });
});

describe('navigation access', () => {
  it('restricts students page to admin and teacher leader', () => {
    const allowed = ['ADMIN', 'TEACHER_LEADER'];
    expect(isRoleAllowedForNav('ADMIN', allowed)).toBe(true);
    expect(isRoleAllowedForNav('TEACHER', allowed)).toBe(false);
  });

  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
