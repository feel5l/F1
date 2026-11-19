import { SESSION_PERIOD_MAX, SESSION_PERIOD_MIN } from './firestoreContracts';

export interface AttendanceSubmitInput {
  selectedClass: string;
  subject: string;
  teacherEmail?: string | null;
}

/** Required fields before persisting a daily attendance session (Attendance page). */
export function validateAttendanceSubmit(input: AttendanceSubmitInput): boolean {
  return Boolean(
    input.selectedClass.trim() && input.subject.trim() && input.teacherEmail?.trim()
  );
}

/** Parses period input; defaults to 2 when invalid and clamps to Firestore rule bounds. */
export function parseAttendancePeriod(period: string): number {
  const n = parseInt(period, 10);
  if (!Number.isFinite(n) || n < SESSION_PERIOD_MIN) return 2;
  if (n > SESSION_PERIOD_MAX) return SESSION_PERIOD_MAX;
  return n;
}

export type DefaultAttendanceEntry = { status: 'حاضر'; note: string };

/** Default present status for each student when loading a class roster. */
export function buildDefaultAttendanceMap(
  studentIds: readonly string[]
): Record<string, DefaultAttendanceEntry> {
  const map: Record<string, DefaultAttendanceEntry> = {};
  for (const id of studentIds) {
    map[id] = { status: 'حاضر', note: '' };
  }
  return map;
}
