import { describe, it, expect } from 'vitest';
import {
  buildAbsenceNotificationMessage,
  buildGuardianWhatsAppUrl,
  cleanPhoneNumber,
} from './whatsapp';

describe('cleanPhoneNumber', () => {
  it('keeps only digits', () => {
    expect(cleanPhoneNumber('+966 50 123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('0501234567')).toBe('0501234567');
  });

  it('handles empty or symbol-only input', () => {
    expect(cleanPhoneNumber('')).toBe('');
    expect(cleanPhoneNumber('---')).toBe('');
  });
});

describe('buildAbsenceNotificationMessage', () => {
  it('includes student name and formatted date', () => {
    const message = buildAbsenceNotificationMessage('أحمد محمد', '٦ سبتمبر ٢٠٢٦');
    expect(message).toContain('أحمد محمد');
    expect(message).toContain('٦ سبتمبر ٢٠٢٦');
    expect(message).toMatch(/السلام عليكم/);
  });
});

describe('buildGuardianWhatsAppUrl', () => {
  it('builds a wa.me URL with encoded message', () => {
    const url = buildGuardianWhatsAppUrl('0501234567', 'مرحباً');
    expect(url).toBe('https://wa.me/0501234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B');
  });

  it('cleans phone before building URL', () => {
    const url = buildGuardianWhatsAppUrl('+966 50 123 4567', 'test');
    expect(url.startsWith('https://wa.me/966501234567?')).toBe(true);
  });
});
