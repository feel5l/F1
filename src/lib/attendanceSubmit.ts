/** Guards attendance session submission (subject/class/teacher must be present). */
export function canSubmitAttendanceSession(
  selectedClass: string,
  subject: string,
  teacherEmail: string | null | undefined
): boolean {
  return Boolean(selectedClass.trim() && subject.trim() && teacherEmail?.trim());
}