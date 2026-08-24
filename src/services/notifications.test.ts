import { describe, it, expect } from 'vitest';
import {
  cleanPhoneNumber,
  buildAttendanceWhatsAppMessage,
  buildWhatsAppUrl,
} from './notifications';

describe('cleanPhoneNumber', () => {
  it('removes non-digit characters', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('(050) 123 4567')).toBe('0501234567');
  });

  it('preserves digits-only input', () => {
    expect(cleanPhoneNumber('966501234567')).toBe('966501234567');
  });
});

describe('buildAttendanceWhatsAppMessage', () => {
  it('includes student name and formatted date in Arabic template', () => {
    const message = buildAttendanceWhatsAppMessage('أحمد محمد', '16 مايو 2026');
    expect(message).toContain('أحمد محمد');
    expect(message).toContain('16 مايو 2026');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds wa.me URL with cleaned phone and encoded message', () => {
    const url = buildWhatsAppUrl('+966 50-123-4567', 'مرحبا');
    expect(url).toMatch(/^https:\/\/wa\.me\/966501234567\?text=/);
    expect(url).toContain(encodeURIComponent('مرحبا'));
  });
});
