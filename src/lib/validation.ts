import { AttendanceStatus } from '../types';

/** Mirrors firestore.rules isValidId — alphanumeric, underscore, hyphen, max 128 chars. */
const VALID_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  'حاضر',
  'غائب',
  'متأخر',
  'بعذر',
] as const;

export const APP_ROLES = [
  'ADMIN',
  'TEACHER',
  'TEACHER_LEADER',
  'ATTENDANCE_OFFICER',
  'SUPERVISOR',
] as const;

export function isValidId(id: string): boolean {
  return id.length > 0 && id.length <= 128 && VALID_ID_PATTERN.test(id);
}

export function isValidAttendanceStatus(status: string): status is AttendanceStatus {
  return (ATTENDANCE_STATUSES as readonly string[]).includes(status);
}

export interface StudentValidationInput {
  fullName: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  isActive: boolean;
}

/** Client-side mirror of firestore.rules isValidStudent. */
export function isValidStudent(data: StudentValidationInput): boolean {
  return (
    typeof data.fullName === 'string' &&
    data.fullName.length > 0 &&
    data.fullName.length <= 200 &&
    isValidId(data.classId) &&
    typeof data.className === 'string' &&
    typeof data.guardianName === 'string' &&
    typeof data.guardianPhone === 'string' &&
    typeof data.isActive === 'boolean'
  );
}

export interface LogValidationInput {
  studentId: string;
  sessionId: string;
  classId: string;
  teacherEmail: string;
  status: string;
}

/** Client-side mirror of firestore.rules isValidLog (excluding timestamp). */
export function isValidLog(data: LogValidationInput): boolean {
  return (
    isValidId(data.studentId) &&
    isValidId(data.sessionId) &&
    isValidId(data.classId) &&
    typeof data.teacherEmail === 'string' &&
    isValidAttendanceStatus(data.status)
  );
}
