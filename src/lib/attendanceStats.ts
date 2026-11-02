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
