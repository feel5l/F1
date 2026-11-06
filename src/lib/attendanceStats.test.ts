import { describe, it, expect } from 'vitest';
import { computeAttendanceRate, countAttendanceStatuses } from './attendanceStats';

describe('countAttendanceStatuses', () => {
  it('aggregates Arabic attendance statuses', () => {
    const counts = countAttendanceStatuses([
      { status: 'حاضر' },
      { status: 'حاضر' },
      { status: 'غائب' },
      { status: 'متأخر' },
      { status: 'بعذر' },
    ]);
    expect(counts).toEqual({ present: 2, absent: 1, late: 1, excused: 1 });
  });
});

describe('computeAttendanceRate', () => {
  it('returns rounded percentage and guards zero total', () => {
    expect(computeAttendanceRate(7, 10)).toBe(70);
    expect(computeAttendanceRate(0, 0)).toBe(0);
  });
});
