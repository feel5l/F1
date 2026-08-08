import { describe, it, expect } from 'vitest';
import {
  cleanPhoneNumber,
  buildAbsenceNotificationMessage,
  buildWhatsAppNotificationUrl,
} from './whatsappNotification';

describe('cleanPhoneNumber', () => {
  it('keeps only digits', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('(050) 123 4567')).toBe('0501234567');
  });

  it('returns empty string when no digits present', () => {
    expect(cleanPhoneNumber('---')).toBe('');
  });
});

describe('buildAbsenceNotificationMessage', () => {
  it('includes student name and formatted date in Arabic', () => {
    const message = buildAbsenceNotificationMessage(
      'أحمد محمد',
      new Date('2026-06-06T10:00:00')
    );
    expect(message).toContain('أحمد محمد');
    expect(message).toContain('السلام عليكم');
    expect(message).toContain('مدرسة زيد بن ثابت');
  });
});

describe('buildWhatsAppNotificationUrl', () => {
  const student = {
    fullName: 'سارة علي',
    guardianPhone: '+966 55 111 2222',
  };

  it('returns null when guardian phone is missing', () => {
    const toDate = () => new Date();
    expect(
      buildWhatsAppNotificationUrl(
        { timestamp: new Date() },
        { fullName: 'سارة', guardianPhone: '' },
        toDate
      )
    ).toBeNull();
    expect(
      buildWhatsAppNotificationUrl({ timestamp: new Date() }, undefined, toDate)
    ).toBeNull();
  });

  it('builds wa.me URL with cleaned phone and encoded message', () => {
    const date = new Date('2026-06-06T10:00:00');
    const url = buildWhatsAppNotificationUrl(
      { timestamp: { toDate: () => date } },
      student,
      (ts) => (ts as { toDate: () => Date }).toDate()
    );

    expect(url).toMatch(/^https:\/\/wa\.me\/966551112222\?text=/);
    expect(decodeURIComponent(url!.split('text=')[1])).toContain('سارة علي');
  });
});
