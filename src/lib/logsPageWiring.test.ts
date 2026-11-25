import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Logs.tsx wiring (WhatsApp guardian notifications)', () => {
  const logs = readFileSync(resolve(__dirname, '../pages/Logs.tsx'), 'utf8');

  it('uses whatsAppGuardian helpers for phone and URL building', () => {
    expect(logs).toMatch(/hasGuardianPhone/);
    expect(logs).toMatch(/sanitizeGuardianPhone/);
    expect(logs).toMatch(/buildAbsenceWhatsAppMessage/);
    expect(logs).toMatch(/buildGuardianWhatsAppUrl/);
  });
});