import { AttendanceStatus } from '../types';

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface ReportStats extends AttendanceStats {
  total: number;
  rate: number;
}

/** Count attendance statuses from a list of records. */
export function computeAttendanceStats(
  records: Array<{ status: AttendanceStatus }>,
): AttendanceStats {
  return {
    present: records.filter((r) => r.status === 'حاضر').length,
    absent: records.filter((r) => r.status === 'غائب').length,
    late: records.filter((r) => r.status === 'متأخر').length,
    excused: records.filter((r) => r.status === 'بعذر').length,
  };
}

/**
 * Calculate report statistics including attendance rate.
 * Rate = (present + late + excused) / total * 100, rounded.
 */
export function calculateReportStats(
  logs: Array<{ status: AttendanceStatus }>,
): ReportStats {
  const total = logs.length;
  const counts = computeAttendanceStats(logs);
  const rate =
    total > 0
      ? Math.round(((counts.present + counts.late + counts.excused) / total) * 100)
      : 0;

  return { total, ...counts, rate };
}

/**
 * Dashboard attendance rate uses total enrolled students as denominator
 * and counts only present + late in the numerator (excused excluded).
 */
export function calculateDashboardAttendanceRate(
  presentCount: number,
  lateCount: number,
  totalStudents: number,
): number {
  return totalStudents > 0
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
    : 0;
}
