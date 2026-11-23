import { describe, it, expect } from 'vitest';
import { normalizeSchoolEmail, SCHOOL_EMAIL_DOMAIN } from './schoolEmail';

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

  it('preserves internal spaces in username-only identifiers', () => {
    expect(normalizeSchoolEmail('zayd 12345')).toBe(`zayd 12345@${SCHOOL_EMAIL_DOMAIN}`);
  });

  it('normalizes username with leading internal segment after trim', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe(`zayd12345@${SCHOOL_EMAIL_DOMAIN}`);
  });
});
