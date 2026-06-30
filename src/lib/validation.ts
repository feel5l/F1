import { AttendanceStatus } from '../types';

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  'حاضر',
  'غائب',
  'متأخر',
  'بعذر',
] as const;

const DOCUMENT_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

/** Mirrors Firestore rules `isValidId` — safe document reference IDs. */
export function isValidDocumentId(id: string): boolean {
  return id.length > 0 && id.length <= 128 && DOCUMENT_ID_PATTERN.test(id);
}

/** Mirrors Firestore rules attendance status allow-list. */
export function isValidAttendanceStatus(status: string): status is AttendanceStatus {
  return ATTENDANCE_STATUSES.includes(status as AttendanceStatus);
}

/** Mirrors Firestore rules session period bounds (1–10). */
export function isValidPeriod(period: number): boolean {
  return Number.isInteger(period) && period >= 1 && period <= 10;
}
