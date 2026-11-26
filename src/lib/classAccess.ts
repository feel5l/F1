import type { Class } from '../types';

/** Restricts class list to teacher-assigned rows when the user cannot view all classes. */
export function filterClassesForUser(
  classes: Class[],
  canViewAll: boolean,
  teacherEmail?: string | null
): Class[] {
  if (canViewAll) return classes;
  return classes.filter((c) => c.teacherEmail === teacherEmail);
}