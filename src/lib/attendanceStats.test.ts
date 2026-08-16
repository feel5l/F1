import { describe, it, expect } from 'vitest';
import {
  computeAttendanceStats,
  filterLogsByDateRange,
  aggregateTrendByDate,
} from './attendanceStats';
import { AttendanceStatus } from '../types';

function makeLog(status: AttendanceStatus, date: Date) {
  return { status, timestamp: { toDate: () => date } };
}

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

  it('filters to current calendar month', () => {
    const logs = [
      makeLog('حاضر', new Date('2026-05-31T23:59:00')),
      makeLog('غائب', new Date('2026-06-01T00:00:00')),
      makeLog('متأخر', new Date('2026-06-06T08:00:00')),
    ];
    const filtered = filterLogsByDateRange(logs, 'month', now);
    expect(filtered.map((l) => l.status)).toEqual(['غائب', 'متأخر']);
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
