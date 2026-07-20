import { describe, it, expect } from 'vitest';
import { normalizeLoginIdentifier, shouldFallbackToGoogleRedirect } from './authUtils';

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

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/invalid-credential')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});
