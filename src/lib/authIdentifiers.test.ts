import { describe, it, expect } from 'vitest';
import {
  GHIYABI_EMAIL_DOMAIN,
  normalizeGhiyabiIdentifier,
} from './authIdentifiers';

describe('normalizeGhiyabiIdentifier', () => {
  it('appends school domain for bare usernames', () => {
    expect(normalizeGhiyabiIdentifier('zayd12345')).toBe(
      `zayd12345${GHIYABI_EMAIL_DOMAIN}`
    );
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeGhiyabiIdentifier('  zayd12345  ')).toBe(
      `zayd12345${GHIYABI_EMAIL_DOMAIN}`
    );
  });

  it('preserves full email addresses', () => {
    expect(normalizeGhiyabiIdentifier('teacher@ghiabi.com')).toBe(
      'teacher@ghiabi.com'
    );
  });

  it('returns empty string for blank input', () => {
    expect(normalizeGhiyabiIdentifier('   ')).toBe('');
  });
});
