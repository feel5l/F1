import type { AttendanceStatus } from '../types';
import { countAttendanceStatuses } from './attendanceStats';

export interface ReportLogStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

/**
 * Report KPIs: rate treats present, late, and excused as non-absent (matches Reports page).
 */
export function summarizeReportLogs(
  entries: ReadonlyArray<{ status: AttendanceStatus }>
): ReportLogStats {
  const { present, absent, late, excused } = countAttendanceStatuses(entries);
  const total = entries.length;
  const rate =
    total > 0 ? Math.round(((present + late + excused) / total) * 100) : 0;
  return { total, present, absent, late, excused, rate };
}
