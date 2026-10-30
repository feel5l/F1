import { describe, it, expect } from 'vitest';
import {
  computeAttendanceStats,
  computeDashboardStats,
  countSessionStatuses,
  filterLogsByDateRange,
  aggregateTrendByDate,
  isAttendanceSubmissionReady,
} from './attendanceStats';
import { AttendanceStatus } from '../types';

function makeLog(status: AttendanceStatus, date: Date) {
  return { status, timestamp: { toDate: () => date } };
}

describe('countSessionStatuses', () => {
  it('counts each status in a session draft', () => {
    const records = [
      { status: 'حاضر' as const },
      { status: 'حاضر' as const },
      { status: 'غائب' as const },
      { status: 'متأخر' as const },
      { status: 'بعذر' as const },
    ];

    expect(countSessionStatuses(records)).toEqual({
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for an empty session', () => {
    expect(countSessionStatuses([])).toEqual({
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});

describe('computeAttendanceStats', () => {
  it('counts statuses and computes discipline rate', () => {
    const logs = [
      { status: 'حاضر' as const },
      { status: 'حاضر' as const },
      { status: 'غائب' as const },
      { status: 'متأخر' as const },
      { status: 'بعذر' as const },
    ];

    expect(computeAttendanceStats(logs)).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 80,
    });
  });

  it('returns zero rate for empty logs', () => {
    expect(computeAttendanceStats([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });
});

describe('isAttendanceSubmissionReady', () => {
  it('requires class, non-empty subject, and teacher email', () => {
    expect(
      isAttendanceSubmissionReady('class-1', 'رياضيات', 'teacher@ghiabi.com'),
    ).toBe(true);
  });

  it('rejects whitespace-only subject', () => {
    expect(isAttendanceSubmissionReady('class-1', '   ', 'teacher@ghiabi.com')).toBe(false);
  });

  it('rejects missing class or user email', () => {
    expect(isAttendanceSubmissionReady('', 'رياضيات', 'teacher@ghiabi.com')).toBe(false);
    expect(isAttendanceSubmissionReady('class-1', 'رياضيات', null)).toBe(false);
  });
});

describe('computeDashboardStats', () => {
  it('counts today absences/late and computes attendance rate from enrollment', () => {
    const logs = [
      { status: 'حاضر' as const },
      { status: 'حاضر' as const },
      { status: 'متأخر' as const },
      { status: 'غائب' as const },
      { status: 'بعذر' as const },
    ];

    expect(computeDashboardStats(logs, 10)).toEqual({
      totalStudents: 10,
      absentToday: 1,
      lateToday: 1,
      attendanceRate: 30,
    });
  });

  it('returns zero attendance rate when there are no enrolled students', () => {
    const logs = [{ status: 'حاضر' as const }];

    expect(computeDashboardStats(logs, 0)).toEqual({
      totalStudents: 0,
      absentToday: 0,
      lateToday: 0,
      attendanceRate: 0,
    });
  });

  it('rounds attendance rate to the nearest whole percent', () => {
    const logs = [
      { status: 'حاضر' as const },
      { status: 'متأخر' as const },
      { status: 'متأخر' as const },
    ];

    expect(computeDashboardStats(logs, 3).attendanceRate).toBe(100);
    expect(computeDashboardStats(logs, 7).attendanceRate).toBe(43);
  });
});

describe('filterLogsByDateRange', () => {
  const now = new Date('2026-06-06T12:00:00');

  it('returns all logs when range is all', () => {
    const logs = [
      makeLog('حاضر', new Date('2020-01-01')),
      makeLog('غائب', now),
    ];
    expect(filterLogsByDateRange(logs, 'all', now)).toHaveLength(2);
  });

  it('filters to today only', () => {
    const logs = [
      makeLog('حاضر', new Date('2026-06-05T23:59:00')),
      makeLog('غائب', new Date('2026-06-06T08:00:00')),
    ];
    const filtered = filterLogsByDateRange(logs, 'today', now);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('غائب');
  });

  it('filters to last 7 days', () => {
    const logs = [
      makeLog('حاضر', new Date('2026-05-28T12:00:00')),
      makeLog('غائب', new Date('2026-06-01T12:00:00')),
    ];
    const filtered = filterLogsByDateRange(logs, 'week', now);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('غائب');
  });
});

describe('aggregateTrendByDate', () => {
  it('groups logs by day and sorts chronologically', () => {
    const logs = [
      makeLog('حاضر', new Date('2026-06-05T10:00:00')),
      makeLog('غائب', new Date('2026-06-05T11:00:00')),
      makeLog('متأخر', new Date('2026-06-06T09:00:00')),
    ];

    const trend = aggregateTrendByDate(logs);

    expect(trend).toHaveLength(2);
    expect(trend[0].حاضر).toBe(1);
    expect(trend[0].غائب).toBe(1);
    expect(trend[1].متأخر).toBe(1);
    expect(trend[0].dateObj.getTime()).toBeLessThan(trend[1].dateObj.getTime());
  });
});
