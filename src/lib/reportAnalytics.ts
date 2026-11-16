import { format, startOfDay, startOfMonth, subDays } from 'date-fns';
import type { AttendanceStatus } from '../types';

export type ReportDateRange = 'today' | 'week' | 'month' | 'all';

type TimestampLike = { toDate(): Date };

/** Client-side relative date filter for attendance logs (Reports page). */
export function filterLogsByDateRange<T extends { timestamp: TimestampLike }>(
  logs: readonly T[],
  dateRange: ReportDateRange,
  now: Date
): T[] {
  if (dateRange === 'all') return [...logs];

  const toDate = (log: T) => log.timestamp.toDate();

  if (dateRange === 'today') {
    const start = startOfDay(now);
    return logs.filter((l) => toDate(l) >= start);
  }
  if (dateRange === 'week') {
    const start = subDays(now, 7);
    return logs.filter((l) => toDate(l) >= start);
  }
  if (dateRange === 'month') {
    const start = startOfMonth(now);
    return logs.filter((l) => toDate(l) >= start);
  }
  return [...logs];
}

export interface DailyAttendanceTrendRow {
  sortKey: string;
  dateObj: Date;
  حاضر: number;
  غائب: number;
  متأخر: number;
  بعذر: number;
}

export function aggregateAttendanceLogsByDay(
  logs: ReadonlyArray<{ timestamp: TimestampLike; status: AttendanceStatus }>
): DailyAttendanceTrendRow[] {
  const daily: Record<string, DailyAttendanceTrendRow> = {};

  for (const log of logs) {
    const d = log.timestamp.toDate();
    const key = format(d, 'yyyy-MM-dd');
    if (!daily[key]) {
      daily[key] = {
        sortKey: key,
        dateObj: d,
        حاضر: 0,
        غائب: 0,
        متأخر: 0,
        بعذر: 0,
      };
    }
    daily[key][log.status]++;
  }

  return Object.values(daily).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}

/** Class list scope for non-admin report views (matches Reports.tsx). */
export function filterClassesForReportsView<T extends { teacherEmail?: string }>(
  classes: readonly T[],
  isAdmin: boolean,
  teacherEmail?: string | null
): T[] {
  if (isAdmin) return [...classes];
  if (!teacherEmail) return [];
  return classes.filter((c) => c.teacherEmail === teacherEmail);
}
