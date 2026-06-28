import { AttendanceStatus } from '../types';

export interface AttendanceCounts {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export function countAttendanceStatuses(statuses: AttendanceStatus[]): AttendanceCounts {
  const present = statuses.filter((status) => status === 'حاضر').length;
  const absent = statuses.filter((status) => status === 'غائب').length;
  const late = statuses.filter((status) => status === 'متأخر').length;
  const excused = statuses.filter((status) => status === 'بعذر').length;

  return {
    total: statuses.length,
    present,
    absent,
    late,
    excused,
  };
}

/** Reports page: present, late, and excused count toward the attendance rate. */
export function calculateReportAttendanceRate(
  counts: Pick<AttendanceCounts, 'present' | 'late' | 'excused' | 'total'>,
): number {
  if (counts.total === 0) {
    return 0;
  }

  return Math.round(((counts.present + counts.late + counts.excused) / counts.total) * 100);
}

/** Dashboard: attendance rate is measured against enrolled students. */
export function calculateDashboardAttendanceRate(
  presentCount: number,
  lateCount: number,
  totalStudents: number,
): number {
  if (totalStudents === 0) {
    return 0;
  }

  return Math.round(((presentCount + lateCount) / totalStudents) * 100);
}
