import { format, startOfDay, subDays, startOfMonth } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AttendanceLog, AttendanceStatus } from '../types';

export type DateRangeFilter = 'today' | 'week' | 'month' | 'all';

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

export interface TrendDataPoint {
  date: string;
  dateObj: Date;
  حاضر: number;
  غائب: number;
  متأخر: number;
  بعذر: number;
}

type LogWithDate = Pick<AttendanceLog, 'status'> & { timestamp: { toDate(): Date } };

/**
 * Computes attendance counts and discipline rate from logs.
 * Rate = (present + late + excused) / total * 100, rounded.
 */
export function computeAttendanceStats(logs: Pick<AttendanceLog, 'status'>[]): AttendanceStats {
  const total = logs.length;
  const present = logs.filter((l) => l.status === 'حاضر').length;
  const absent = logs.filter((l) => l.status === 'غائب').length;
  const late = logs.filter((l) => l.status === 'متأخر').length;
  const excused = logs.filter((l) => l.status === 'بعذر').length;
  const rate = total > 0 ? ((present + late + excused) / total) * 100 : 0;

  return { total, present, absent, late, excused, rate: Math.round(rate) };
}

/**
 * Filters logs by relative date range (client-side).
 */
export function filterLogsByDateRange<T extends LogWithDate>(
  logs: T[],
  dateRange: DateRangeFilter,
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

/**
 * Aggregates attendance logs into daily trend data for charts.
 */
export function aggregateTrendByDate(logs: LogWithDate[]): TrendDataPoint[] {
  const daily: Record<string, TrendDataPoint> = {};

  for (const log of logs) {
    const d = log.timestamp.toDate();
    const key = format(d, 'yyyy-MM-dd');
    if (!daily[key]) {
      daily[key] = {
        date: format(d, 'MMM d', { locale: ar }),
        dateObj: d,
        حاضر: 0,
        غائب: 0,
        متأخر: 0,
        بعذر: 0,
      };
    }
    daily[key][log.status as AttendanceStatus]++;
  }

  return Object.values(daily).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}
