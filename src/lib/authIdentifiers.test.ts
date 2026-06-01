import { describe, it, expect } from 'vitest';
import { GHIABI_EMAIL_DOMAIN, normalizeGhiabiEmail } from './authIdentifiers';

describe('normalizeGhiabiEmail', () => {
  it('appends school domain for username-only input', () => {
    expect(normalizeGhiabiEmail('zayd12345')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
  });

  it('preserves a full email address', () => {
    expect(normalizeGhiabiEmail('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeGhiabiEmail('  zayd12345  ')).toBe(`zayd12345${GHIABI_EMAIL_DOMAIN}`);
    expect(normalizeGhiabiEmail('  user@example.com ')).toBe('user@example.com');
  });

  it('does not double-append domain when @ is present', () => {
    const result = normalizeGhiabiEmail('name@other-school.edu');
    expect(result).toBe('name@other-school.edu');
    expect(result).not.toContain(`${GHIABI_EMAIL_DOMAIN}${GHIABI_EMAIL_DOMAIN}`);
  });
});
