import type { AppRole } from '../types';
import { canViewAllClasses } from './roleAccess';

/**
 * Class list scope for attendance (admin, attendance officer, leaders, supervisors see all).
 */
export function filterClassesForAttendanceView<T extends { teacherEmail?: string }>(
  classes: readonly T[],
  isAdmin: boolean,
  appRole: AppRole | undefined,
  teacherEmail?: string | null
): T[] {
  if (canViewAllClasses(isAdmin, appRole)) return [...classes];
  if (!teacherEmail) return [];
  return classes.filter((c) => c.teacherEmail === teacherEmail);
}
