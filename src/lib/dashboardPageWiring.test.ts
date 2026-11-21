import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: dashboard KPIs must keep teacher-scoped enrollment and log aggregation helpers. */
describe('Dashboard.tsx KPI and scope wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Dashboard.tsx'), 'utf8');

  it('computes teacher-scoped student counts via dashboardScope helpers', () => {
    expect(source).toMatch(/teacherClassIdsFromClasses/);
    expect(source).toMatch(/countStudentsAssignedToClasses/);
    expect(source).toMatch(/where\('teacherEmail', '==', user\?\.email\)/);
  });

  it('aggregates today logs through attendanceStats and teacherDataScope', () => {
    expect(source).toMatch(/summarizeDashboardLogStatuses/);
    expect(source).toMatch(/computeDashboardAttendanceRate/);
    expect(source).toMatch(/shouldFilterAttendanceByTeacherEmail\(isAdmin, user\?\.email\)/);
    expect(source).toMatch(/where\('timestamp', '>=', todayTS\)/);
  });

  it('does not embed attendance-rate math inline in the page', () => {
    expect(source).not.toMatch(/presentCount\s*\+\s*lateCount\)\s*\/\s*totalStudents/);
    expect(source).not.toMatch(/status === 'غائب'/);
  });
});