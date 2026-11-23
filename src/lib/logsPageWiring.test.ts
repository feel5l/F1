import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: attendance logs view + guardian WhatsApp must stay on shared libs. */
describe('Logs.tsx scoped query and guardian notify wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Logs.tsx'), 'utf8');

  it('scopes log queries via teacherDataScope instead of duplicating admin checks', () => {
    expect(source).toMatch(/usesSchoolWideAttendanceLogQuery\(isAdmin\)/);
    expect(source).toMatch(/where\('teacherEmail', '==', user\?\.email\)/);
    expect(source).not.toMatch(/isAdmin\s*\?\s*query\(/);
  });

  it('builds guardian WhatsApp URLs through whatsappNotify helpers', () => {
    expect(source).toMatch(/buildGuardianAttendanceMessage/);
    expect(source).toMatch(/sanitizeGuardianPhone/);
    expect(source).toMatch(/buildGuardianWhatsAppUrl/);
    expect(source).not.toMatch(/wa\.me\/\$\{/);
  });

  it('renders status badges via resolveAttendanceStatusDisplay', () => {
    expect(source).toMatch(/resolveAttendanceStatusDisplay\(status\)/);
    expect(source).not.toMatch(/status === 'حاضر'/);
  });

  it('guards WhatsApp action when guardian phone is missing', () => {
    expect(source).toMatch(/!student\?\.guardianPhone/);
    expect(source).toMatch(/رقم ولي الأمر غير متوفر/);
    expect(source).toMatch(/disabled=\{!student\?\.guardianPhone\}/);
  });
});