import { describe, it, expect } from 'vitest';
import { resolvePasswordResetEmail } from './loginCredentials';

describe('resolvePasswordResetEmail', () => {
  it('returns normalized school email for username-only input', () => {
    expect(resolvePasswordResetEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses', () => {
    expect(resolvePasswordResetEmail('teacher@example.com')).toBe('teacher@example.com');
  });

  it('returns null for empty or whitespace-only input', () => {
    expect(resolvePasswordResetEmail('')).toBeNull();
    expect(resolvePasswordResetEmail('   ')).toBeNull();
  });
});