import { startOfDay, startOfMonth, subDays } from 'date-fns';
import { AttendanceStatus } from '../types';
import { calculateAttendanceStats, AttendanceStats } from './attendanceStats';

export type DateRangeFilter = 'today' | 'week' | 'month' | 'all';

export interface TimestampLike {
  toDate(): Date;
}

export interface ReportLog {
  status: AttendanceStatus;
  timestamp: TimestampLike;
}

export interface TrendDataPoint {
  date: string;
  dateObj: Date;
  حاضر: number;
  غائب: number;
  متأخر: number;
  بعذر: number;
}

export interface ClassWithTeacher {
  teacherEmail?: string;
}

/**
 * Filters attendance logs by relative date range (client-side).
 */
export function filterLogsByDateRange<T extends ReportLog>(
  logs: T[],
  range: DateRangeFilter,
  referenceDate: Date = new Date()
): T[] {
  if (range === 'all') return logs;

  let start: Date;
  if (range === 'today') {
    start = startOfDay(referenceDate);
  } else if (range === 'week') {
    start = subDays(referenceDate, 7);
  } else {
    start = startOfMonth(referenceDate);
  }

  return logs.filter((log) => log.timestamp.toDate() >= start);
}

/**
 * Computes report summary stats from filtered logs.
 * Rate counts present + late + excused as compliant (matches Reports page).
 */
export function calculateReportStats(
  logs: { status: AttendanceStatus }[]
): AttendanceStats {
  return calculateAttendanceStats(logs.map((l) => l.status));
}

/**
 * Aggregates daily attendance counts for trend charts.
 */
export function buildTrendData(
  logs: ReportLog[],
  formatDateLabel: (date: Date) => string = (d) =>
    `${d.getMonth() + 1}/${d.getDate()}`
): TrendDataPoint[] {
  const daily: Record<string, TrendDataPoint> = {};

  logs.forEach((log) => {
    const d = log.timestamp.toDate();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!daily[key]) {
      daily[key] = {
        date: formatDateLabel(d),
        dateObj: d,
        حاضر: 0,
        غائب: 0,
        متأخر: 0,
        بعذر: 0,
      };
    }
    daily[key][log.status]++;
  });

  return Object.values(daily).sort(
    (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
  );
}

/**
 * Filters classes for the reports page based on admin status.
 * Non-admins see only their homeroom classes.
 */
export function filterClassesForReports<T extends ClassWithTeacher>(
  classes: T[],
  isAdmin: boolean,
  userEmail: string | undefined
): T[] {
  if (isAdmin) return classes;
  return classes.filter((c) => c.teacherEmail === userEmail);
}
