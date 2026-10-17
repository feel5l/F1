import { startOfDay, startOfMonth, subDays } from 'date-fns';

export type ReportDateRange = 'today' | 'week' | 'month' | 'all';

export interface TimestampLike {
  toDate(): Date;
}

/** Client-side relative date filters used on the Reports page. */
export function filterLogsByReportDateRange<T extends { timestamp: TimestampLike }>(
  logs: T[],
  dateRange: ReportDateRange,
  now: Date = new Date()
): T[] {
  if (dateRange === 'all') return logs;
  if (dateRange === 'today') {
    const start = startOfDay(now);
    return logs.filter((l) => l.timestamp.toDate() >= start);
  }
  if (dateRange === 'week') {
    const start = subDays(now, 7);
    return logs.filter((l) => l.timestamp.toDate() >= start);
  }
  const start = startOfMonth(now);
  return logs.filter((l) => l.timestamp.toDate() >= start);
}
