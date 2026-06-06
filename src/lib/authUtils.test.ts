import { describe, it, expect } from 'vitest';
import { normalizeLoginIdentifier } from './authUtils';

describe('normalizeLoginIdentifier', () => {
  it('appends @ghiabi.com for bare usernames', () => {
    expect(normalizeLoginIdentifier('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeLoginIdentifier('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
    expect(normalizeLoginIdentifier(' user@x.com ')).toBe('user@x.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeLoginIdentifier('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
    expect(normalizeLoginIdentifier('admin@gmail.com')).toBe('admin@gmail.com');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeLoginIdentifier('   ')).toBe('');
  });
});
