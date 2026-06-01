import type { AttendanceStatus } from '../types';

export interface AttendanceCountInput {
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

/** Computes attendance breakdown and attendance rate (present + late + excused) / total. */
export function computeAttendanceSummary(
  records: AttendanceCountInput[],
): AttendanceSummary {
  const total = records.length;
  const present = records.filter((r) => r.status === 'حاضر').length;
  const absent = records.filter((r) => r.status === 'غائب').length;
  const late = records.filter((r) => r.status === 'متأخر').length;
  const excused = records.filter((r) => r.status === 'بعذر').length;
  const rate = total > 0 ? Math.round(((present + late + excused) / total) * 100) : 0;

  return { total, present, absent, late, excused, rate };
}
