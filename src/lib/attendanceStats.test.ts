import { describe, it, expect } from 'vitest';
import {
  computeAttendanceRate,
  computeDashboardAttendanceRate,
  computeReportsDisciplineRate,
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

describe('computeReportsDisciplineRate', () => {
  it('counts present, late, and excused toward discipline rate', () => {
    expect(computeReportsDisciplineRate(50, 10, 5, 100)).toBe(65);
    expect(computeReportsDisciplineRate(0, 0, 0, 0)).toBe(0);
  });

  it('excludes pure absent entries from the numerator', () => {
    expect(computeReportsDisciplineRate(80, 0, 0, 100)).toBe(80);
  });
});

describe('computeDashboardAttendanceRate', () => {
  it('uses enrolled students as denominator, not log count', () => {
    expect(computeDashboardAttendanceRate(45, 5, 50)).toBe(100);
    expect(computeDashboardAttendanceRate(40, 0, 50)).toBe(80);
    expect(computeDashboardAttendanceRate(0, 0, 0)).toBe(0);
  });

  it('does not count excused absences as attendance on dashboard', () => {
    expect(computeDashboardAttendanceRate(40, 5, 50)).toBe(90);
  });
});