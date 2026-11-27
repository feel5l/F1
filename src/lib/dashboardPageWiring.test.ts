import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Dashboard.tsx wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Dashboard.tsx'), 'utf8');

  it('uses computeDashboardAttendanceRate for today KPI', () => {
    expect(source).toMatch(/computeDashboardAttendanceRate/);
  });

  it('scopes non-admin student counts and logs to the signed-in teacher', () => {
    expect(source).toMatch(/where\('teacherEmail', '==', user\?\.email\)/);
    expect(source).toMatch(/!isAdmin && user\?\.email/);
  });
});