import { describe, it, expect } from 'vitest';
import {
  cleanGuardianPhone,
  buildGuardianAbsenceMessage,
  buildWhatsAppUrl,
} from './whatsappUtils';

describe('cleanGuardianPhone', () => {
  it('strips non-digit characters', () => {
    expect(cleanGuardianPhone('+966 50-123-4567')).toBe('966501234567');
    expect(cleanGuardianPhone('0501234567')).toBe('0501234567');
  });

  it('returns empty string for input with no digits', () => {
    expect(cleanGuardianPhone('---')).toBe('');
  });
});

describe('buildGuardianAbsenceMessage', () => {
  it('includes student name and formatted date in Arabic', () => {
    const date = new Date('2026-06-06T10:00:00');
    const message = buildGuardianAbsenceMessage('أحمد', date);
    expect(message).toContain('أحمد');
    expect(message).toContain('السلام عليكم');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds wa.me URL with encoded message', () => {
    const url = buildWhatsAppUrl('050-123-4567', 'مرحبا');
    expect(url).toMatch(/^https:\/\/wa\.me\/0501234567\?text=/);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('مرحبا');
  });
});
