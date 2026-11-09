import { describe, it, expect } from 'vitest';
import {
  computeAttendanceRate,
  computeDashboardAttendanceRate,
  countAttendanceStatuses,
  summarizeDashboardLogStatuses,
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

describe('summarizeDashboardLogStatuses', () => {
  it('counts present, absent, and late from log statuses', () => {
    expect(
      summarizeDashboardLogStatuses(['حاضر', 'حاضر', 'غائب', 'متأخر', 'بعذر'])
    ).toEqual({ presentCount: 2, absentCount: 1, lateCount: 1 });
  });
});

describe('computeDashboardAttendanceRate', () => {
  it('treats late as attending and rounds percentage', () => {
    expect(computeDashboardAttendanceRate(8, 2, 20)).toBe(50);
    expect(computeDashboardAttendanceRate(0, 0, 0)).toBe(0);
  });
});
