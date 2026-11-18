/**
 * Shared teacher-vs-admin scoping for attendance logs and related queries.
 * Keeps Dashboard, Logs, and Reports aligned on who may see school-wide data.
 */

/** Non-admins with an email only see logs they recorded (Dashboard, Reports). */
export function shouldFilterAttendanceByTeacherEmail(
  isAdmin: boolean,
  teacherEmail?: string | null
): boolean {
  return !isAdmin && Boolean(teacherEmail);
}

/** Logs page uses a school-wide query only for admins (see Logs.tsx). */
export function usesSchoolWideAttendanceLogQuery(isAdmin: boolean): boolean {
  return isAdmin;
}