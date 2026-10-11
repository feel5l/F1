import { describe, it, expect } from 'vitest';
import {
  validatePasswordResetEmail,
  resolvePasswordResetEmail,
  resolveLoginEmail,
} from './loginValidation';

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

describe('resolveLoginEmail', () => {
  it('normalizes bare usernames the same way as password reset', () => {
    expect(resolveLoginEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
    expect(resolveLoginEmail('zayd12345')).toBe(resolvePasswordResetEmail('zayd12345'));
  });

  it('preserves full email addresses after trim', () => {
    expect(resolveLoginEmail(' teacher@example.com ')).toBe('teacher@example.com');
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
