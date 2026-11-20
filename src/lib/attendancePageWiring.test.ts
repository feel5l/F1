import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard: attendance submit creates a session then per-student logs
 * using extracted helpers (period bounds, validation, class scope).
 */
describe('Attendance.tsx session + logs wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Attendance.tsx'), 'utf8');

  it('scopes visible classes and defaults roster attendance via lib helpers', () => {
    expect(source).toMatch(/filterClassesForAttendanceView/);
    expect(source).toMatch(/buildDefaultAttendanceMap/);
    expect(source).toMatch(/where\('isActive', '==', true\)/);
  });

  it('validates submit input and parses period before Firestore writes', () => {
    expect(source).toMatch(/validateAttendanceSubmit/);
    expect(source).toMatch(/parseAttendancePeriod\(period\)/);
    expect(source).toMatch(/addDoc\(collection\(db, 'sessions'\)/);
  });

  it('persists one attendanceLogs row per student via buildAttendanceLogWrites', () => {
    expect(source).toMatch(/buildAttendanceLogWrites\(attendance/);
    expect(source).toMatch(/addDoc\(collection\(db, 'attendanceLogs'\)/);
    expect(source).toMatch(/teacherEmail: user\.email/);
  });

  it('surfaces write failures through handleFirestoreError', () => {
    expect(source).toMatch(/handleFirestoreError\(error, OperationType\.WRITE, 'attendanceLogs'\)/);
  });
});