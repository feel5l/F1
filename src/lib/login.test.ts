import { describe, it, expect } from 'vitest';
import { normalizeLoginIdentifier } from './login';

describe('normalizeLoginIdentifier', () => {
  it('appends school domain for bare usernames', () => {
    expect(normalizeLoginIdentifier('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeLoginIdentifier('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
    expect(normalizeLoginIdentifier('user@gmail.com')).toBe('user@gmail.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeLoginIdentifier('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
    expect(normalizeLoginIdentifier('  teacher@ghiabi.com ')).toBe('teacher@ghiabi.com');
  });

  it('supports custom domains', () => {
    expect(normalizeLoginIdentifier('user', 'example.org')).toBe('user@example.org');
  });
});
