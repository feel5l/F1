import { AttendanceStatus } from '../types';

export interface AttendanceCounts {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

/** Count attendance records by status (used in daily attendance and reports). */
export function countAttendanceByStatus(statuses: AttendanceStatus[]): AttendanceCounts {
  return {
    total: statuses.length,
    present: statuses.filter((status) => status === 'حاضر').length,
    absent: statuses.filter((status) => status === 'غائب').length,
    late: statuses.filter((status) => status === 'متأخر').length,
    excused: statuses.filter((status) => status === 'بعذر').length,
  };
}

/**
 * Discipline rate treats present, late, and excused as compliant attendance.
 * Matches the percentage shown on the reports dashboard.
 */
export function calculateDisciplineRate(counts: Pick<AttendanceCounts, 'present' | 'late' | 'excused' | 'total'>): number {
  const { present, late, excused, total } = counts;
  return total > 0 ? Math.round(((present + late + excused) / total) * 100) : 0;
}
