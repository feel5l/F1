import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, sanitizePhoneDigits } from './notifications';

describe('sanitizePhoneDigits', () => {
  it('removes formatting characters from guardian phone numbers', () => {
    expect(sanitizePhoneDigits('+966 50 123 4567')).toBe('966501234567');
    expect(sanitizePhoneDigits('(050)123-4567')).toBe('0501234567');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds encoded wa.me links', () => {
    const url = buildWhatsAppUrl('966501234567', 'مرحباً');
    expect(url).toBe('https://wa.me/966501234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B');
  });
});
