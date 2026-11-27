import type { AttendanceStatus } from '../types';

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

/** Reports page: on-time + late + excused over log entries (discipline rate). */
export function computeReportsDisciplineRate(
  present: number,
  late: number,
  excused: number,
  totalLogs: number
): number {
  if (totalLogs <= 0) return 0;
  return Math.round(((present + late + excused) / totalLogs) * 100);
}

/** Dashboard: present + late over enrolled students for today. */
export function computeDashboardAttendanceRate(
  present: number,
  late: number,
  totalStudents: number
): number {
  if (totalStudents <= 0) return 0;
  return Math.round(((present + late) / totalStudents) * 100);
}