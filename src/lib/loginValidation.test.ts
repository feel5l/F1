import { describe, it, expect } from 'vitest';
import { validatePasswordResetEmail } from './loginValidation';

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
