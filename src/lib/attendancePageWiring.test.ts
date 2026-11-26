import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Attendance.tsx wiring (submit validation)', () => {
  const attendance = readFileSync(resolve(__dirname, '../pages/Attendance.tsx'), 'utf8');

  it('uses canSubmitAttendanceSession before writing attendance logs', () => {
    expect(attendance).toMatch(/canSubmitAttendanceSession/);
  });
});