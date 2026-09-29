import { describe, it, expect } from 'vitest';
import { shouldUseGoogleRedirectFallback } from './authLogin';

describe('shouldUseGoogleRedirectFallback', () => {
  it('returns true for popup blocked or closed by user', () => {
    expect(shouldUseGoogleRedirectFallback({ code: 'auth/popup-blocked' })).toBe(true);
    expect(shouldUseGoogleRedirectFallback({ code: 'auth/popup-closed-by-user' })).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldUseGoogleRedirectFallback({ code: 'auth/wrong-password' })).toBe(false);
    expect(shouldUseGoogleRedirectFallback(null)).toBe(false);
  });
});
