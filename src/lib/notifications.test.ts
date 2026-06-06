import { describe, it, expect } from 'vitest';
import { cleanPhoneNumber, buildWhatsAppAbsenceUrl } from './notifications';

describe('cleanPhoneNumber', () => {
  it('removes non-digit characters', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
    expect(cleanPhoneNumber('(050) 123 4567')).toBe('0501234567');
  });

  it('preserves digits-only input', () => {
    expect(cleanPhoneNumber('966501234567')).toBe('966501234567');
  });
});

describe('buildWhatsAppAbsenceUrl', () => {
  it('builds wa.me URL with encoded Arabic message', () => {
    const url = buildWhatsAppAbsenceUrl({
      studentName: 'أحمد',
      formattedDate: '١ يونيو ٢٠٢٦',
      guardianPhone: '+966 50-111-2222',
    });

    expect(url).toMatch(/^https:\/\/wa\.me\/966501112222\?text=/);
    const textParam = decodeURIComponent(url.split('?text=')[1]);
    expect(textParam).toContain('أحمد');
    expect(textParam).toContain('١ يونيو ٢٠٢٦');
    expect(textParam).toContain('السلام عليكم');
  });
});
