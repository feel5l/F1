import { describe, it, expect } from 'vitest';
import { shouldFallbackToGoogleRedirect } from './googleAuth';

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup blocked or closed by user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other errors or missing code', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(null)).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});