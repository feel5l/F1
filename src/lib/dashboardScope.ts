/**
 * Dashboard KPI scope: teachers only count students in classes they teach.
 */

export function teacherClassIdsFromClasses<T extends { id: string; teacherEmail?: string }>(
  classes: readonly T[],
  teacherEmail: string | null | undefined
): string[] {
  if (!teacherEmail) return [];
  return classes.filter((c) => c.teacherEmail === teacherEmail).map((c) => c.id);
}

export function countStudentsAssignedToClasses<T extends { classId: string }>(
  students: readonly T[],
  classIds: readonly string[]
): number {
  if (classIds.length === 0) return 0;
  const allowed = new Set(classIds);
  return students.filter((s) => allowed.has(s.classId)).length;
}

export function dashboardEnrolledStudentCount(
  isAdmin: boolean,
  totalStudentsWhenAdmin: number,
  students: readonly { classId: string }[],
  teacherClassIds: readonly string[]
): number {
  if (isAdmin) return totalStudentsWhenAdmin;
  return countStudentsAssignedToClasses(students, teacherClassIds);
}