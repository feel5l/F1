import { describe, it, expect } from 'vitest';
import { buildWhatsAppNotificationUrl, sanitizeGuardianPhone } from './whatsapp';

describe('sanitizeGuardianPhone', () => {
  it('keeps digits only', () => {
    expect(sanitizeGuardianPhone('+966 50-123-4567')).toBe('966501234567');
  });
});

describe('buildWhatsAppNotificationUrl', () => {
  it('builds wa.me link with encoded message', () => {
    const url = buildWhatsAppNotificationUrl('0501234567', 'مرحباً');
    expect(url).toMatch(/^https:\/\/wa\.me\/0501234567\?text=/);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('مرحباً');
  });
});
