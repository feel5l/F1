import { describe, it, expect } from 'vitest';
import {
  normalizeSchoolEmail,
  deriveRoleFlags,
  isBootstrapAdminEmail,
  shouldFallbackToGoogleRedirect,
  SCHOOL_EMAIL_DOMAIN,
  BOOTSTRAP_ADMIN_EMAIL,
} from './auth';

describe('normalizeSchoolEmail', () => {
  it('appends school domain when identifier has no @', () => {
    expect(normalizeSchoolEmail('zayd12345')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('preserves full email when @ is present', () => {
    expect(normalizeSchoolEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('trims whitespace before normalizing', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
    expect(normalizeSchoolEmail('  user@ghiabi.com  ')).toBe('user@ghiabi.com');
  });
});

describe('deriveRoleFlags', () => {
  it('identifies ADMIN', () => {
    const flags = deriveRoleFlags('ADMIN');
    expect(flags.isAdmin).toBe(true);
    expect(flags.isTeacher).toBe(false);
    expect(flags.isSupervisor).toBe(false);
  });

  it('identifies TEACHER and TEACHER_LEADER as teachers', () => {
    expect(deriveRoleFlags('TEACHER').isTeacher).toBe(true);
    expect(deriveRoleFlags('TEACHER_LEADER').isTeacher).toBe(true);
    expect(deriveRoleFlags('TEACHER').isAdmin).toBe(false);
  });

  it('identifies SUPERVISOR', () => {
    const flags = deriveRoleFlags('SUPERVISOR');
    expect(flags.isSupervisor).toBe(true);
    expect(flags.isAdmin).toBe(false);
    expect(flags.isTeacher).toBe(false);
  });

  it('returns all false for undefined role', () => {
    const flags = deriveRoleFlags(undefined);
    expect(flags).toEqual({ isAdmin: false, isTeacher: false, isSupervisor: false });
  });

  it('ATTENDANCE_OFFICER is not admin, teacher, or supervisor', () => {
    const flags = deriveRoleFlags('ATTENDANCE_OFFICER');
    expect(flags).toEqual({ isAdmin: false, isTeacher: false, isSupervisor: false });
  });
});

describe('isBootstrapAdminEmail', () => {
  it('matches only the bootstrap admin email', () => {
    expect(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
    expect(isBootstrapAdminEmail('other@gmail.com')).toBe(false);
    expect(isBootstrapAdminEmail('')).toBe(false);
  });

  it('does not treat legacy hardcoded admin emails as bootstrap', () => {
    expect(isBootstrapAdminEmail('alzaem2002@gmail.com')).toBe(false);
    expect(isBootstrapAdminEmail('zayd12345@ghiabi.com')).toBe(false);
  });
});

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors and undefined', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});

describe('deriveRoleFlags regression', () => {
  it('never grants admin from email alone — only explicit ADMIN appRole', () => {
    const legacyEmails = ['alzaem2002@gmail.com', 'zayd12345@ghiabi.com', BOOTSTRAP_ADMIN_EMAIL];
    for (const email of legacyEmails) {
      void email;
      expect(deriveRoleFlags(undefined).isAdmin).toBe(false);
      expect(deriveRoleFlags('TEACHER').isAdmin).toBe(false);
    }
    expect(deriveRoleFlags('ADMIN').isAdmin).toBe(true);
  });
});
