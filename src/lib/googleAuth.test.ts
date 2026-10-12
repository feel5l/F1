import { describe, it, expect } from 'vitest';
import { shouldFallbackToGoogleRedirect } from './googleAuth';

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/popup-blocked' })).toBe(true);
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/popup-closed-by-user' })).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect({ code: 'auth/network-request-failed' })).toBe(false);
    expect(shouldFallbackToGoogleRedirect(new Error('fail'))).toBe(false);
    expect(shouldFallbackToGoogleRedirect(null)).toBe(false);
  });
});
