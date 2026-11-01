import { describe, it, expect } from 'vitest';
import { shouldFallbackToGoogleRedirect } from './authUtils';

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup blocked or closed errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/network-request-failed')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});
