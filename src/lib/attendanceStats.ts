import { AttendanceStatus } from '../types';

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

/**
 * Computes attendance summary stats. Rate counts present + late + excused as compliant.
 */
export function calculateAttendanceStats(
  statuses: AttendanceStatus[]
): AttendanceStats {
  const total = statuses.length;
  const present = statuses.filter((s) => s === 'حاضر').length;
  const absent = statuses.filter((s) => s === 'غائب').length;
  const late = statuses.filter((s) => s === 'متأخر').length;
  const excused = statuses.filter((s) => s === 'بعذر').length;
  const rate =
    total > 0 ? Math.round(((present + late + excused) / total) * 100) : 0;

  return { total, present, absent, late, excused, rate };
}
