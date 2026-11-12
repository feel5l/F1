import type { AttendanceStatus } from '../types';

export interface DashboardLogStatusSummary {
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

/** Counts today's log rows by status (Dashboard KPIs). */
export function summarizeDashboardLogStatuses(
  statuses: ReadonlyArray<AttendanceStatus>
): DashboardLogStatusSummary {
  return {
    presentCount: statuses.filter((s) => s === 'حاضر').length,
    absentCount: statuses.filter((s) => s === 'غائب').length,
    lateCount: statuses.filter((s) => s === 'متأخر').length,
  };
}

/**
 * Dashboard attendance rate: present + late over enrolled students (matches legacy UI).
 */
export function computeDashboardAttendanceRate(
  presentCount: number,
  lateCount: number,
  totalStudents: number
): number {
  if (totalStudents <= 0) return 0;
  return Math.round(((presentCount + lateCount) / totalStudents) * 100);
}

export interface AttendanceStatusCounts {
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export function countAttendanceStatuses(
  entries: ReadonlyArray<{ status: AttendanceStatus }>
): AttendanceStatusCounts {
  return {
    present: entries.filter((a) => a.status === 'حاضر').length,
    absent: entries.filter((a) => a.status === 'غائب').length,
    late: entries.filter((a) => a.status === 'متأخر').length,
    excused: entries.filter((a) => a.status === 'بعذر').length,
  };
}

export function computeAttendanceRate(present: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((present / total) * 100);
}

/** Reports page rate: present + late + excused over filtered log rows. */
export function computeReportAttendanceRate(
  present: number,
  late: number,
  excused: number,
  total: number
): number {
  if (total <= 0) return 0;
  return Math.round(((present + late + excused) / total) * 100);
}
