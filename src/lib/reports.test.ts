import { describe, it, expect } from 'vitest';
import {
  filterLogsByDateRange,
  calculateReportStats,
  buildTrendData,
  filterClassesForReports,
} from './reports';
import { AttendanceStatus } from '../types';

function makeLog(status: AttendanceStatus, date: Date) {
  return { status, timestamp: { toDate: () => date } };
}

describe('filterLogsByDateRange', () => {
  const ref = new Date('2026-03-15T12:00:00');
  const logs = [
    makeLog('حاضر', new Date('2026-03-15T08:00:00')),
    makeLog('غائب', new Date('2026-03-10T08:00:00')),
    makeLog('متأخر', new Date('2026-02-01T08:00:00')),
  ];

  it('returns all logs when range is all', () => {
    expect(filterLogsByDateRange(logs, 'all', ref)).toHaveLength(3);
  });

  it('filters to today only', () => {
    const result = filterLogsByDateRange(logs, 'today', ref);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('حاضر');
  });

  it('filters to last 7 days', () => {
    const result = filterLogsByDateRange(logs, 'week', ref);
    expect(result).toHaveLength(2);
  });

  it('filters to current month', () => {
    const result = filterLogsByDateRange(logs, 'month', ref);
    expect(result).toHaveLength(2);
  });
});

describe('calculateReportStats', () => {
  it('computes rate including present, late, and excused', () => {
    const stats = calculateReportStats([
      { status: 'حاضر' },
      { status: 'غائب' },
      { status: 'متأخر' },
      { status: 'بعذر' },
    ]);
    expect(stats).toEqual({
      total: 4,
      present: 1,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 75,
    });
  });

  it('returns zero rate for empty logs', () => {
    expect(calculateReportStats([]).rate).toBe(0);
  });
});

describe('buildTrendData', () => {
  it('aggregates counts per day and sorts chronologically', () => {
    const data = buildTrendData([
      makeLog('حاضر', new Date('2026-03-10T08:00:00')),
      makeLog('غائب', new Date('2026-03-10T09:00:00')),
      makeLog('حاضر', new Date('2026-03-11T08:00:00')),
    ]);

    expect(data).toHaveLength(2);
    expect(data[0].حاضر).toBe(1);
    expect(data[0].غائب).toBe(1);
    expect(data[1].حاضر).toBe(1);
    expect(data[0].dateObj.getTime()).toBeLessThan(data[1].dateObj.getTime());
  });
});

describe('filterClassesForReports', () => {
  const classes = [
    { id: '1', teacherEmail: 't1@ghiabi.com' },
    { id: '2', teacherEmail: 't2@ghiabi.com' },
  ];

  it('returns all classes for admin', () => {
    expect(filterClassesForReports(classes, true, 't1@ghiabi.com')).toHaveLength(2);
  });

  it('restricts non-admin to own classes', () => {
    expect(filterClassesForReports(classes, false, 't1@ghiabi.com')).toEqual([
      classes[0],
    ]);
  });
});
