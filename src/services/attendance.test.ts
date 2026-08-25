import { describe, it, expect } from 'vitest';
import { computeAttendanceStats, calculateReportStats } from './attendance';
import { AttendanceStatus } from '../types';

const sampleLogs = [
  { status: 'حاضر' as AttendanceStatus },
  { status: 'حاضر' as AttendanceStatus },
  { status: 'غائب' as AttendanceStatus },
  { status: 'متأخر' as AttendanceStatus },
  { status: 'بعذر' as AttendanceStatus },
];

describe('computeAttendanceStats', () => {
  it('counts each status correctly', () => {
    expect(computeAttendanceStats(sampleLogs)).toEqual({
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for empty input', () => {
    expect(computeAttendanceStats([])).toEqual({
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});

describe('calculateReportStats', () => {
  it('computes rate as (present + late + excused) / total, rounded', () => {
    const stats = calculateReportStats(sampleLogs);
    expect(stats.total).toBe(5);
    expect(stats.present).toBe(2);
    expect(stats.absent).toBe(1);
    expect(stats.late).toBe(1);
    expect(stats.excused).toBe(1);
    // (2 + 1 + 1) / 5 = 80%
    expect(stats.rate).toBe(80);
  });

  it('returns rate 0 for empty logs', () => {
    expect(calculateReportStats([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });

  it('rounds rate to nearest integer', () => {
    const logs = [
      { status: 'حاضر' as AttendanceStatus },
      { status: 'حاضر' as AttendanceStatus },
      { status: 'غائب' as AttendanceStatus },
    ];
    // (2 + 0 + 0) / 3 = 66.67 → 67
    expect(calculateReportStats(logs).rate).toBe(67);
  });
});
