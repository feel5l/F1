import type { AttendanceStatus } from '../types';

/** Matches firestore.rules isValidLog status whitelist. */
export const FIRESTORE_ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  'حاضر',
  'غائب',
  'متأخر',
  'بعذر',
];

export const SESSION_PERIOD_MIN = 1;
export const SESSION_PERIOD_MAX = 10;
const FIRESTORE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_FIRESTORE_ID_LENGTH = 128;

/** Mirrors firestore.rules isValidId. */
export function isValidFirestoreDocumentId(id: string): boolean {
  return (
    id.length > 0 &&
    id.length <= MAX_FIRESTORE_ID_LENGTH &&
    FIRESTORE_ID_PATTERN.test(id)
  );
}

/** Mirrors firestore.rules isValidSession period bounds. */
export function isValidFirestoreSessionPeriod(period: number): boolean {
  return (
    Number.isInteger(period) &&
    period >= SESSION_PERIOD_MIN &&
    period <= SESSION_PERIOD_MAX
  );
}

export function isFirestoreAttendanceStatus(status: string): status is AttendanceStatus {
  return (FIRESTORE_ATTENDANCE_STATUSES as readonly string[]).includes(status);
}