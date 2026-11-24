import { describe, it, expect } from 'vitest';
import { shouldFallbackToGoogleRedirect } from './googleAuth';

describe('shouldFallbackToGoogleRedirect', () => {
  it('returns true for popup-blocked and popup-closed-by-user', () => {
    expect(shouldFallbackToGoogleRedirect('auth/popup-blocked')).toBe(true);
    expect(shouldFallbackToGoogleRedirect('auth/popup-closed-by-user')).toBe(true);
  });

  it('returns false for other auth errors', () => {
    expect(shouldFallbackToGoogleRedirect('auth/cancelled-popup-request')).toBe(false);
    expect(shouldFallbackToGoogleRedirect(undefined)).toBe(false);
  });
});