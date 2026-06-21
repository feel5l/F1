import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  normalizeLoginIdentifier,
  isBootstrapAdminEmail,
  deriveRoleFlags,
  resolveDisplayRole,
  canViewNavItem,
  canViewAllClasses,
  getRoleLabel,
} from './authUtils';
import { AppRole } from '../types';

describe('normalizeLoginIdentifier', () => {
  it('appends school domain for bare usernames', () => {
    expect(normalizeLoginIdentifier('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeLoginIdentifier('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeLoginIdentifier('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });

  it('does not double-append domain when @ is present', () => {
    expect(normalizeLoginIdentifier('user@example.com')).toBe('user@example.com');
  });
});

describe('isBootstrapAdminEmail', () => {
  it('recognizes the configured bootstrap admin', () => {
    expect(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
  });

  it('rejects other emails', () => {
    expect(isBootstrapAdminEmail('other@ghiabi.com')).toBe(false);
  });
});

describe('deriveRoleFlags', () => {
  it('marks ADMIN correctly', () => {
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

  it('returns false flags when role is undefined', () => {
    expect(deriveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('does not grant teacher flag to ATTENDANCE_OFFICER', () => {
    expect(deriveRoleFlags('ATTENDANCE_OFFICER').isTeacher).toBe(false);
  });
});

describe('resolveDisplayRole', () => {
  it('uses explicit appRole when present', () => {
    expect(resolveDisplayRole('SUPERVISOR')).toBe('SUPERVISOR');
  });

  it('falls back to ADMIN when isAdmin is true', () => {
    expect(resolveDisplayRole(undefined, true)).toBe('ADMIN');
  });

  it('defaults to TEACHER when no role is known', () => {
    expect(resolveDisplayRole(undefined, false)).toBe('TEACHER');
  });
});

describe('canViewNavItem', () => {
  const adminOnly: AppRole[] = ['ADMIN'];

  it('allows matching roles', () => {
    expect(canViewNavItem(adminOnly, 'ADMIN')).toBe(true);
  });

  it('denies non-matching roles', () => {
    expect(canViewNavItem(adminOnly, 'TEACHER')).toBe(false);
  });
});

describe('canViewAllClasses', () => {
  it('allows elevated roles to see every class', () => {
    expect(canViewAllClasses('ADMIN')).toBe(true);
    expect(canViewAllClasses('ATTENDANCE_OFFICER')).toBe(true);
    expect(canViewAllClasses('TEACHER_LEADER')).toBe(true);
    expect(canViewAllClasses('SUPERVISOR')).toBe(true);
  });

  it('restricts plain teachers to their own classes', () => {
    expect(canViewAllClasses('TEACHER')).toBe(false);
    expect(canViewAllClasses(undefined)).toBe(false);
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER')).toBe('معلم');
  });

  it('returns generic label for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
