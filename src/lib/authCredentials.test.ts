import { describe, expect, it } from 'vitest';
import {
  GHIYABI_LOGIN_DOMAIN,
  normalizeGhiyabiLoginIdentifier,
  shouldUseGoogleRedirectOnPopupError,
} from './authCredentials';

describe('normalizeGhiyabiLoginIdentifier', () => {
  it('appends school domain for username-only identifiers', () => {
    expect(normalizeGhiyabiLoginIdentifier('zayd12345')).toBe(`zayd12345@${GHIYABI_LOGIN_DOMAIN}`);
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeGhiyabiLoginIdentifier('  zayd12345  ')).toBe(`zayd12345@${GHIYABI_LOGIN_DOMAIN}`);
  });

  it('preserves full email addresses', () => {
    expect(normalizeGhiyabiLoginIdentifier('teacher@example.com')).toBe('teacher@example.com');
  });

  it('returns empty string for blank input', () => {
    expect(normalizeGhiyabiLoginIdentifier('   ')).toBe('');
  });
});

describe('shouldUseGoogleRedirectOnPopupError', () => {
  it('returns true for popup blocked or closed errors', () => {
    expect(shouldUseGoogleRedirectOnPopupError('auth/popup-blocked')).toBe(true);
    expect(shouldUseGoogleRedirectOnPopupError('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldUseGoogleRedirectOnPopupError('auth/invalid-credential')).toBe(false);
    expect(shouldUseGoogleRedirectOnPopupError(undefined)).toBe(false);
  });
});
