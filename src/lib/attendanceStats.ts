import { AttendanceStatus } from '../types';

export interface AttendanceEntry {
  status: AttendanceStatus;
  note: string;
}

export function computeAttendanceStats(
  attendance: Record<string, AttendanceEntry>
): {
  present: number;
  absent: number;
  late: number;
  excused: number;
} {
  const values = Object.values(attendance);
  return {
    present: values.filter((a) => a.status === 'حاضر').length,
    absent: values.filter((a) => a.status === 'غائب').length,
    late: values.filter((a) => a.status === 'متأخر').length,
    excused: values.filter((a) => a.status === 'بعذر').length,
  };
}
