import { describe, it, expect } from 'vitest';
import { filterLogsByReportDateRange } from './reportDateRange';

const fixedNow = new Date('2026-10-17T15:00:00Z');

function logAt(iso: string) {
  return {
    id: iso,
    timestamp: { toDate: () => new Date(iso) },
  };
}

describe('filterLogsByReportDateRange', () => {
  const logs = [
    logAt('2026-10-17T10:00:00Z'),
    logAt('2026-10-12T10:00:00Z'),
    logAt('2026-09-01T10:00:00Z'),
  ];

  it('returns all logs for "all"', () => {
    expect(filterLogsByReportDateRange(logs, 'all', fixedNow)).toHaveLength(3);
  });

  it('keeps only today from start of local day', () => {
    const filtered = filterLogsByReportDateRange(logs, 'today', fixedNow);
    expect(filtered.map((l) => l.id)).toEqual(['2026-10-17T10:00:00Z']);
  });

  it('keeps logs within the last 7 days for "week"', () => {
    const filtered = filterLogsByReportDateRange(logs, 'week', fixedNow);
    expect(filtered.map((l) => l.id)).toEqual([
      '2026-10-17T10:00:00Z',
      '2026-10-12T10:00:00Z',
    ]);
  });

  it('keeps logs from the current month for "month"', () => {
    const filtered = filterLogsByReportDateRange(logs, 'month', fixedNow);
    expect(filtered.map((l) => l.id)).toEqual([
      '2026-10-17T10:00:00Z',
      '2026-10-12T10:00:00Z',
    ]);
  });
});
