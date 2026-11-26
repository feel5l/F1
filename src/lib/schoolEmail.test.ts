import { describe, it, expect } from 'vitest';
import { canRequestPasswordReset, normalizeSchoolEmail, SCHOOL_EMAIL_DOMAIN } from './schoolEmail';

describe('normalizeSchoolEmail', () => {
  it('appends school domain for username-only identifiers', () => {
    expect(normalizeSchoolEmail('zayd12345')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('leaves full email addresses unchanged', () => {
    expect(normalizeSchoolEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('returns empty string for blank input', () => {
    expect(normalizeSchoolEmail('   ')).toBe('');
  });
});

describe('canRequestPasswordReset', () => {
  it('requires a non-empty normalized identifier', () => {
    expect(canRequestPasswordReset('zayd12345')).toBe(true);
    expect(canRequestPasswordReset('   ')).toBe(false);
  });
});