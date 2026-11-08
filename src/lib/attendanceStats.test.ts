import { describe, it, expect } from 'vitest';
import {
  computeAttendanceRate,
  computeDashboardAttendanceRate,
  countAttendanceStatuses,
} from './attendanceStats';

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

describe('computeDashboardAttendanceRate', () => {
  it('counts present and late toward the rate and rounds', () => {
    expect(computeDashboardAttendanceRate(8, 2, 10)).toBe(100);
    expect(computeDashboardAttendanceRate(1, 0, 3)).toBe(33);
  });

  it('returns zero when there are no students', () => {
    expect(computeDashboardAttendanceRate(5, 5, 0)).toBe(0);
  });
});
