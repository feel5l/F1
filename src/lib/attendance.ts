import { AttendanceStatus } from '../types';

export interface AttendanceEntry {
  status: AttendanceStatus;
  note: string;
}

export function createInitialAttendance(
  studentIds: string[]
): Record<string, AttendanceEntry> {
  const initial: Record<string, AttendanceEntry> = {};
  for (const id of studentIds) {
    initial[id] = { status: 'حاضر', note: '' };
  }
  return initial;
}

export function computeAttendanceStats(
  attendance: Record<string, AttendanceEntry>
) {
  const list = Object.values(attendance);
  return {
    present: list.filter((a) => a.status === 'حاضر').length,
    absent: list.filter((a) => a.status === 'غائب').length,
    late: list.filter((a) => a.status === 'متأخر').length,
    excused: list.filter((a) => a.status === 'بعذر').length,
  };
}
