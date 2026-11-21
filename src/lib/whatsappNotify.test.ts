import { describe, it, expect } from 'vitest';
import {
  buildGuardianAttendanceMessage,
  buildGuardianWhatsAppUrl,
  sanitizeGuardianPhone,
} from './whatsappNotify';

describe('sanitizeGuardianPhone', () => {
  it('keeps digits only', () => {
    expect(sanitizeGuardianPhone('+966 50 123-4567')).toBe('966501234567');
    expect(sanitizeGuardianPhone('0501234567')).toBe('0501234567');
  });
});

describe('buildGuardianAttendanceMessage', () => {
  it('includes student name and formatted date', () => {
    const msg = buildGuardianAttendanceMessage('أحمد', '١٣ نوفمبر ٢٠٢٦');
    expect(msg).toContain('أحمد');
    expect(msg).toContain('١٣ نوفمبر ٢٠٢٦');
    expect(msg).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildGuardianWhatsAppUrl', () => {
  it('encodes message query for wa.me', () => {
    const url = buildGuardianWhatsAppUrl('966501234567', 'مرحبا');
    expect(url).toBe('https://wa.me/966501234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7');
  });
});
