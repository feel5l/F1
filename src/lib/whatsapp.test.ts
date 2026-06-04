import { describe, it, expect } from 'vitest';
import {
  sanitizePhoneNumber,
  buildWhatsAppUrl,
  buildAbsenceWhatsAppMessage,
} from './whatsapp';

describe('sanitizePhoneNumber', () => {
  it('strips non-digit characters', () => {
    expect(sanitizePhoneNumber('+966 (50) 123-4567')).toBe('966501234567');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds wa.me link with encoded message', () => {
    const url = buildWhatsAppUrl('050-111', 'مرحبا');
    expect(url).toMatch(/^https:\/\/wa\.me\/050111\?text=/);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('مرحبا');
  });
});

describe('buildAbsenceWhatsAppMessage', () => {
  it('includes student name and formatted date', () => {
    const msg = buildAbsenceWhatsAppMessage('خالد', '٤ يونيو ٢٠٢٦');
    expect(msg).toContain('خالد');
    expect(msg).toContain('٤ يونيو ٢٠٢٦');
    expect(msg).toContain('غائباً');
  });
});
