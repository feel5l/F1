import { describe, it, expect } from 'vitest';
import { normalizeLoginIdentifier, shouldFallbackToGoogleRedirect } from './loginIdentifier';

describe('normalizeLoginIdentifier', () => {
  it('appends default domain for bare usernames', () => {
    expect(normalizeLoginIdentifier('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeLoginIdentifier('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(normalizeLoginIdentifier('teacher@school.edu')).toBe('teacher@school.edu');
  });

  it('supports custom domains', () => {
    expect(normalizeLoginIdentifier('user', '@custom.test')).toBe('user@custom.test');
  });
});

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});
