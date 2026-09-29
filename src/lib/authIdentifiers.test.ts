import { describe, it, expect } from 'vitest';
import { GHIABI_EMAIL_DOMAIN, toLoginEmail } from './authIdentifiers';

describe('toLoginEmail', () => {
  it('appends the school domain to usernames', () => {
    expect(toLoginEmail('zayd12345')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
  });

  it('trims whitespace before normalization', () => {
    expect(toLoginEmail('  zayd12345  ')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
  });

  it('leaves full email addresses unchanged', () => {
    expect(toLoginEmail('user@example.com')).toBe('user@example.com');
    expect(toLoginEmail('user@ghiabi.com')).toBe('user@ghiabi.com');
  });
});
