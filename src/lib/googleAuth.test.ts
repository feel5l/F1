import { describe, it, expect } from 'vitest';
import { shouldFallbackToGoogleRedirect } from './googleAuth';

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked', () => {
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/popup-blocked' })).toBe(true);
  });

  it('returns true for popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/popup-closed-by-user' })).toBe(true);
  });

  it('returns false for other Firebase errors', () => {
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/network-request-failed' })).toBe(false);
  });

  it('returns false for non-object errors', () => {
    expect(shouldFallbackToGoogleRedirect(null)).toBe(false);
    expect(shouldFallbackToGoogleRedirect('error')).toBe(false);
  });
});
