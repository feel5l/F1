import { describe, it, expect } from 'vitest';
import { validatePasswordResetEmail, resolvePasswordResetEmail } from './loginValidation';

describe('validatePasswordResetEmail', () => {
  it('rejects empty or whitespace-only input', () => {
    expect(validatePasswordResetEmail('')).toBe('يرجى إدخال البريد الإلكتروني');
    expect(validatePasswordResetEmail('   ')).toBe('يرجى إدخال البريد الإلكتروني');
  });

  it('accepts usernames and emails', () => {
    expect(validatePasswordResetEmail('zayd12345')).toBeNull();
    expect(validatePasswordResetEmail(' user@ghiabi.com ')).toBeNull();
  });
});

describe('resolvePasswordResetEmail', () => {
  it('normalizes bare usernames to school domain', () => {
    expect(resolvePasswordResetEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });

  it('preserves full email addresses after trim', () => {
    expect(resolvePasswordResetEmail(' teacher@example.com ')).toBe('teacher@example.com');
  });
});
