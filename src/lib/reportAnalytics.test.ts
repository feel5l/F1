import { describe, it, expect } from 'vitest';
import {
  aggregateAttendanceLogsByDay,
  filterClassesForReportsView,
  filterLogsByDateRange,
} from './reportAnalytics';

const ts = (iso: string) => ({ toDate: () => new Date(iso) });

describe('filterLogsByDateRange', () => {
  const logs = [
    { id: 'old', timestamp: ts('2026-11-01T10:00:00Z'), status: 'غائب' as const },
    { id: 'week', timestamp: ts('2026-11-10T10:00:00Z'), status: 'حاضر' as const },
    { id: 'today', timestamp: ts('2026-11-13T08:00:00Z'), status: 'متأخر' as const },
  ];
  const now = new Date('2026-11-13T12:00:00Z');

  it('keeps all logs when range is all', () => {
    expect(filterLogsByDateRange(logs, 'all', now)).toHaveLength(3);
  });

  it('filters to today start-of-day', () => {
    expect(filterLogsByDateRange(logs, 'today', now).map((l) => l.id)).toEqual(['today']);
  });

  it('filters to rolling seven days', () => {
    expect(filterLogsByDateRange(logs, 'week', now).map((l) => l.id)).toEqual(['week', 'today']);
  });

  it('filters from start of calendar month', () => {
    expect(filterLogsByDateRange(logs, 'month', now)).toHaveLength(3);
    expect(filterLogsByDateRange(logs, 'month', now).map((l) => l.id)).toContain('old');
  });
});

describe('aggregateAttendanceLogsByDay', () => {
  it('sums statuses per day and sorts chronologically', () => {
    const rows = aggregateAttendanceLogsByDay([
      { timestamp: ts('2026-11-12T09:00:00Z'), status: 'حاضر' },
      { timestamp: ts('2026-11-12T11:00:00Z'), status: 'غائب' },
      { timestamp: ts('2026-11-13T09:00:00Z'), status: 'متأخر' },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[0].sortKey).toBe('2026-11-12');
    expect(rows[0]).toMatchObject({ حاضر: 1, غائب: 1, متأخر: 0, بعذر: 0 });
    expect(rows[1].sortKey).toBe('2026-11-13');
    expect(rows[1].متأخر).toBe(1);
  });
});

describe('filterClassesForReportsView', () => {
  const classes = [
    { id: 'a', teacherEmail: 't1@ghiabi.com' },
    { id: 'b', teacherEmail: 't2@ghiabi.com' },
  ];

  it('returns all classes for admin', () => {
    expect(filterClassesForReportsView(classes, true, 't1@ghiabi.com')).toHaveLength(2);
  });

  it('scopes to teacher email for non-admin', () => {
    expect(filterClassesForReportsView(classes, false, 't1@ghiabi.com')).toEqual([classes[0]]);
  });

  it('returns empty when teacher email missing', () => {
    expect(filterClassesForReportsView(classes, false, null)).toEqual([]);
  });
});
