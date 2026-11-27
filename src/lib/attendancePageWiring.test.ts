import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Attendance.tsx wiring (submit validation)', () => {
  const attendance = readFileSync(resolve(__dirname, '../pages/Attendance.tsx'), 'utf8');

  it('uses canSubmitAttendanceSession before writing attendance logs', () => {
    expect(attendance).toMatch(/canSubmitAttendanceSession/);
  });

  it('scopes class list with canViewAllClasses and staff appRole', () => {
    expect(attendance).toMatch(/canViewAllClasses\(isAdmin, staffMember\?\.appRole\)/);
    expect(attendance).toMatch(/filterClassesForUser/);
  });

  it('refetches classes when staff appRole changes (role affects canViewAll)', () => {
    expect(attendance).toMatch(/\}, \[user, isAdmin, staffMember\?\.appRole\]\)/);
  });
});