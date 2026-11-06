import { describe, it, expect } from 'vitest';
import { resolveGhiabiEmail } from './loginIdentifiers';

describe('resolveGhiabiEmail', () => {
  it('trims surrounding whitespace', () => {
    expect(resolveGhiabiEmail('  user@school.com  ')).toBe('user@school.com');
  });

  it('returns value unchanged when it already contains @', () => {
    expect(resolveGhiabiEmail('a@ghiabi.com')).toBe('a@ghiabi.com');
    expect(resolveGhiabiEmail('me@other.domain')).toBe('me@other.domain');
  });

  it('appends @ghiabi.com for username-only identifiers', () => {
    expect(resolveGhiabiEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });
});
