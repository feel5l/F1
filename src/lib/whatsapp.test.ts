import { describe, it, expect } from 'vitest';
import {
  cleanGuardianPhone,
  buildAbsenceWhatsAppMessage,
  buildWhatsAppUrl,
  hasGuardianPhone,
} from './whatsapp';

describe('cleanGuardianPhone', () => {
  it('keeps digits only for international formats', () => {
    expect(cleanGuardianPhone('+966 50-123-4567')).toBe('966501234567');
  });

  it('handles plain digit strings', () => {
    expect(cleanGuardianPhone('0501234567')).toBe('0501234567');
  });
});

describe('buildAbsenceWhatsAppMessage', () => {
  it('includes student name and formatted date in Arabic template', () => {
    const message = buildAbsenceWhatsAppMessage('أحمد', '٢٤ يونيو ٢٠٢٦');
    expect(message).toContain('أحمد');
    expect(message).toContain('٢٤ يونيو ٢٠٢٦');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with encoded message', () => {
    const url = buildWhatsAppUrl('+966 50 123 4567', 'مرحباً');
    expect(url).toMatch(/^https:\/\/wa\.me\/966501234567\?text=/);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('مرحباً');
  });
});

describe('hasGuardianPhone', () => {
  it('rejects missing or blank phone numbers', () => {
    expect(hasGuardianPhone(undefined)).toBe(false);
    expect(hasGuardianPhone('   ')).toBe(false);
  });

  it('accepts non-empty phone numbers', () => {
    expect(hasGuardianPhone('0501234567')).toBe(true);
  });
});
