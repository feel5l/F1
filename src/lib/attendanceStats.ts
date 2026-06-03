import type { AttendanceStatus } from '../types';

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

export function calculateAttendanceStats(
  logs: ReadonlyArray<{ status: AttendanceStatus }>
): AttendanceStats {
  const total = logs.length;
  const present = logs.filter((l) => l.status === 'حاضر').length;
  const absent = logs.filter((l) => l.status === 'غائب').length;
  const late = logs.filter((l) => l.status === 'متأخر').length;
  const excused = logs.filter((l) => l.status === 'بعذر').length;
  const rate = total > 0 ? ((present + late + excused) / total) * 100 : 0;

  return {
    total,
    present,
    absent,
    late,
    excused,
    rate: Math.round(rate),
  };
}
