import { describe, it, expect } from 'vitest';
import { cleanPhoneNumber, buildWhatsAppUrl } from './whatsapp';

describe('cleanPhoneNumber', () => {
  it('strips non-digit characters', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('(050) 123 4567')).toBe('0501234567');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with encoded message', () => {
    const url = buildWhatsAppUrl('0501234567', 'مرحباً');
    expect(url).toBe('https://wa.me/0501234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B');
  });

  it('cleans phone before building URL', () => {
    const url = buildWhatsAppUrl('+966-50-123-4567', 'test');
    expect(url.startsWith('https://wa.me/966501234567?text=')).toBe(true);
  });
});
