import { describe, expect, it } from 'vitest';
import {
  buildAbsenceNotificationMessage,
  buildWhatsAppUrl,
  sanitizePhoneNumber,
} from './notifications';

describe('sanitizePhoneNumber', () => {
  it('keeps digits only', () => {
    expect(sanitizePhoneNumber('+966 50-123-4567')).toBe('966501234567');
    expect(sanitizePhoneNumber('0501234567')).toBe('0501234567');
  });
});

describe('buildAbsenceNotificationMessage', () => {
  it('includes the student name and formatted date', () => {
    const message = buildAbsenceNotificationMessage('محمد أحمد', '9 يونيو 2026');

    expect(message).toContain('محمد أحمد');
    expect(message).toContain('9 يونيو 2026');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with encoded Arabic text', () => {
    const url = buildWhatsAppUrl('050-123-4567', 'مرحباً');

    expect(url.startsWith('https://wa.me/0501234567?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('مرحباً'));
  });
});
