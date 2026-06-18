import { describe, it, expect } from 'vitest';
import {
  cleanPhoneNumber,
  buildAbsenceMessage,
  buildAbsenceWhatsAppUrl,
} from './notifications';

describe('cleanPhoneNumber', () => {
  it('keeps only digits', () => {
    expect(cleanPhoneNumber('+966 50 123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('0501234567')).toBe('0501234567');
  });

  it('returns empty string when no digits present', () => {
    expect(cleanPhoneNumber('---')).toBe('');
  });
});

describe('buildAbsenceMessage', () => {
  it('includes student name and formatted date in Arabic template', () => {
    const message = buildAbsenceMessage('أحمد محمد', '١٥ مايو ٢٠٢٦');
    expect(message).toContain('أحمد محمد');
    expect(message).toContain('١٥ مايو ٢٠٢٦');
    expect(message).toContain('مدرسة زيد بن ثابت');
    expect(message).toMatch(/^السلام عليكم/);
  });
});

describe('buildAbsenceWhatsAppUrl', () => {
  it('builds wa.me URL with encoded message and cleaned phone', () => {
    const url = buildAbsenceWhatsAppUrl('سارة', '+966 55 111 2222', '١٥ مايو ٢٠٢٦');
    expect(url).toMatch(/^https:\/\/wa\.me\/966551112222\?text=/);
    expect(decodeURIComponent(url.split('?text=')[1])).toContain('سارة');
  });
});
