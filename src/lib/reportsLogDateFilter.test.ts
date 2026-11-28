import { describe, it, expect } from 'vitest';
import { filterLogsByReportsDateRange } from './reportsLogDateFilter';

const ts = (d: Date) => ({ toDate: () => d });

describe('filterLogsByReportsDateRange', () => {
  const now = new Date('2026-11-26T12:00:00Z');
  const logs = [
    { id: '1', timestamp: ts(new Date('2026-11-26T08:00:00Z')) },
    { id: '2', timestamp: ts(new Date('2026-11-20T08:00:00Z')) },
    { id: '3', timestamp: ts(new Date('2026-10-15T08:00:00Z')) },
  ];

  it('returns all logs for "all" range', () => {
    expect(filterLogsByReportsDateRange(logs, 'all', now)).toHaveLength(3);
  });

  it('filters today from start of day', () => {
    expect(filterLogsByReportsDateRange(logs, 'today', now).map((l) => l.id)).toEqual(['1']);
  });

  it('filters last 7 days for week range', () => {
    expect(filterLogsByReportsDateRange(logs, 'week', now).map((l) => l.id)).toEqual(['1', '2']);
  });

  it('filters from start of month', () => {
    expect(filterLogsByReportsDateRange(logs, 'month', now).map((l) => l.id)).toEqual(['1', '2']);
  });
});