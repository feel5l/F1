import { describe, it, expect } from 'vitest';
import {
  buildAbsenceWhatsAppMessage,
  buildGuardianWhatsAppUrl,
  hasGuardianPhone,
  sanitizeGuardianPhone,
} from './whatsAppGuardian';

describe('sanitizeGuardianPhone', () => {
  it('strips non-digits from Saudi-style numbers', () => {
    expect(sanitizeGuardianPhone('+966 50 123 4567')).toBe('966501234567');
    expect(sanitizeGuardianPhone('050-123-4567')).toBe('0501234567');
  });
});

describe('hasGuardianPhone', () => {
  it('rejects empty, whitespace, or symbol-only input', () => {
    expect(hasGuardianPhone(undefined)).toBe(false);
    expect(hasGuardianPhone('')).toBe(false);
    expect(hasGuardianPhone('   ')).toBe(false);
    expect(hasGuardianPhone('---')).toBe(false);
  });

  it('accepts any string with at least one digit', () => {
    expect(hasGuardianPhone('0501234567')).toBe(true);
  });
});

describe('buildAbsenceWhatsAppMessage', () => {
  it('includes student name and formatted date', () => {
    const msg = buildAbsenceWhatsAppMessage('أحمد', '١٠ نوفمبر ٢٠٢٦');
    expect(msg).toContain('أحمد');
    expect(msg).toContain('١٠ نوفمبر ٢٠٢٦');
    expect(msg).toContain('زيد بن ثابت');
  });
});

describe('buildGuardianWhatsAppUrl', () => {
  it('builds a wa.me URL with encoded Arabic message', () => {
    const url = buildGuardianWhatsAppUrl('966501234567', 'مرحباً');
    expect(url).toBe(`https://wa.me/966501234567?text=${encodeURIComponent('مرحباً')}`);
  });
});