import { AttendanceStatus } from '../types';

export interface DashboardLogStatusCounts {
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

/**
 * Counts today's attendance log rows for dashboard KPIs.
 * Excused absences are excluded from all three counters (matches legacy dashboard behavior).
 */
export function summarizeDashboardLogStatuses(
  statuses: AttendanceStatus[]
): DashboardLogStatusCounts {
  return {
    presentCount: statuses.filter((s) => s === 'حاضر').length,
    absentCount: statuses.filter((s) => s === 'غائب').length,
    lateCount: statuses.filter((s) => s === 'متأخر').length,
  };
}

/**
 * Computes dashboard attendance rate: (present + late) / totalStudents.
 * Uses student headcount as denominator, unlike report log-based rates.
 */
export function calculateDashboardAttendanceRate(
  presentCount: number,
  lateCount: number,
  totalStudents: number
): number {
  if (totalStudents <= 0) return 0;
  return Math.round(((presentCount + lateCount) / totalStudents) * 100);
}
