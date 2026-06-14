import { describe, it, expect } from 'vitest';
import {
  normalizeSchoolEmail,
  isBootstrapAdminEmail,
  BOOTSTRAP_ADMIN_EMAIL,
  SCHOOL_EMAIL_DOMAIN,
} from './auth-utils';

describe('normalizeSchoolEmail', () => {
  it('appends school domain to bare usernames', () => {
    expect(normalizeSchoolEmail('zayd12345')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('preserves full email addresses unchanged', () => {
    expect(normalizeSchoolEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('does not double-append domain when @ is present', () => {
    expect(normalizeSchoolEmail('user@ghiabi.com')).toBe('user@ghiabi.com');
  });

  it('returns empty string unchanged when input is blank', () => {
    expect(normalizeSchoolEmail('   ')).toBe('');
  });
});

describe('isBootstrapAdminEmail', () => {
  it('returns true only for the configured bootstrap admin', () => {
    expect(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL)).toBe(true);
    expect(isBootstrapAdminEmail('other@gmail.com')).toBe(false);
    expect(isBootstrapAdminEmail('')).toBe(false);
  });
});
