export interface AttendanceSubmissionInput {
  classId: string;
  subject: string;
  userEmail?: string | null;
}

const VALIDATION_ERROR = 'يرجى ملء كافة البيانات';

/**
 * Validates required fields before submitting attendance.
 * Returns an error message when invalid, or null when valid.
 */
export function validateAttendanceSubmission(
  input: AttendanceSubmissionInput
): string | null {
  const classId = input.classId?.trim();
  const subject = input.subject?.trim();
  const userEmail = input.userEmail?.trim();
  if (!classId || !subject || !userEmail) {
    return VALIDATION_ERROR;
  }
  return null;
}

/**
 * Builds the session document payload for Firestore.
 */
export function buildSessionPayload(
  classId: string,
  subject: string,
  period: string,
  teacherEmail: string
) {
  return {
    period: parseInt(period, 10),
    subject,
    classId,
    teacherEmail,
  };
}

/**
 * Builds a single attendance log payload for Firestore.
 */
export function buildAttendanceLogPayload(
  studentId: string,
  sessionId: string,
  classId: string,
  teacherEmail: string,
  status: string,
  note: string
) {
  return {
    studentId,
    sessionId,
    classId,
    teacherEmail,
    status,
    note,
  };
}
