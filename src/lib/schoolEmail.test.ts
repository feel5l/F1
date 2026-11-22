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

  it('does not treat internal spaces as a full email (merged login UX)', () => {
    expect(normalizeSchoolEmail('zayd 12345')).toBe(`zayd 12345@${SCHOOL_EMAIL_DOMAIN}`);
  });
});