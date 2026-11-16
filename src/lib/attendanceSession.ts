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

/** Parses period input; defaults to 2 when invalid (matches Attendance UI default). */
export function parseAttendancePeriod(period: string): number {
  const n = parseInt(period, 10);
  return Number.isFinite(n) && n > 0 ? n : 2;
}
