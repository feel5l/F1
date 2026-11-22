import type { AttendanceStatus } from '../types';

export type AttendanceDraft = { status: AttendanceStatus; note: string };

export interface AttendanceLogWrite {
  studentId: string;
  sessionId: string;
  classId: string;
  teacherEmail: string;
  status: AttendanceStatus;
  note: string;
}

/** One Firestore attendanceLogs document per student (Attendance submitAttendance). */
export function buildAttendanceLogWrites(
  attendance: Record<string, AttendanceDraft>,
  meta: { sessionId: string; classId: string; teacherEmail: string }
): AttendanceLogWrite[] {
  return Object.entries(attendance).map(([studentId, data]) => ({
    studentId,
    sessionId: meta.sessionId,
    classId: meta.classId,
    teacherEmail: meta.teacherEmail,
    status: data.status,
    note: data.note,
  }));
}