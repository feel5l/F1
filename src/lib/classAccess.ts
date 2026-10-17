/** Reports page: only admins see every class; teachers see classes they teach. */
export function filterClassesForReportView<T extends { teacherEmail?: string }>(
  classes: T[],
  isAdmin: boolean,
  userEmail?: string | null
): T[] {
  if (isAdmin) return classes;
  if (!userEmail) return [];
  return classes.filter((c) => c.teacherEmail === userEmail);
}
