import { describe, it, expect } from 'vitest';
import {
  cleanPhoneNumber,
  buildWhatsAppUrl,
  buildAbsenceWhatsAppMessage,
  hasGuardianPhone,
} from './notifications';

describe('cleanPhoneNumber', () => {
  it('removes spaces, dashes, and country-code plus signs', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
  });

  it('keeps digits-only numbers unchanged', () => {
    expect(cleanPhoneNumber('0501234567')).toBe('0501234567');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with encoded Arabic message text', () => {
    const url = buildWhatsAppUrl('0501234567', 'مرحباً');
    expect(url).toBe('https://wa.me/0501234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B');
  });

  it('cleans formatted phone numbers before building the URL', () => {
    const url = buildWhatsAppUrl('+966 50 123 4567', 'test');
    expect(url.startsWith('https://wa.me/966501234567?')).toBe(true);
  });
});

describe('buildAbsenceWhatsAppMessage', () => {
  it('includes student name and formatted date in the guardian message', () => {
    const message = buildAbsenceWhatsAppMessage('محمد أحمد', '١٣ يونيو ٢٠٢٦');
    expect(message).toContain('محمد أحمد');
    expect(message).toContain('١٣ يونيو ٢٠٢٦');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('hasGuardianPhone', () => {
  it('returns true when a non-empty phone is provided', () => {
    expect(hasGuardianPhone('0501234567')).toBe(true);
    expect(hasGuardianPhone(' 050 ')).toBe(true);
  });

  it('returns false for missing or blank phone numbers', () => {
    expect(hasGuardianPhone(undefined)).toBe(false);
    expect(hasGuardianPhone(null)).toBe(false);
    expect(hasGuardianPhone('')).toBe(false);
    expect(hasGuardianPhone('   ')).toBe(false);
  });
});
