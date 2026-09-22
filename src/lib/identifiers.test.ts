import { describe, it, expect } from 'vitest';
import { normalizeSchoolEmail } from './identifiers';

describe('normalizeSchoolEmail', () => {
  it('appends school domain for bare usernames', () => {
    expect(normalizeSchoolEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeSchoolEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeSchoolEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
    expect(normalizeSchoolEmail(' user@ghiabi.com ')).toBe('user@ghiabi.com');
  });

  it('supports custom domains', () => {
    expect(normalizeSchoolEmail('user', 'school.edu')).toBe('user@school.edu');
  });
});
