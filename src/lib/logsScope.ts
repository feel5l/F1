export const DEFAULT_LOGS_LIMIT = 100;

export type LogsQueryScope =
  | { type: 'all'; limit: number }
  | { type: 'by-teacher'; teacherEmail: string; limit: number };

/**
 * Determines whether attendance logs should be scoped to the current teacher.
 * Admins see all logs; non-admins are restricted to their own records.
 */
export function resolveLogsQueryScope(
  isAdmin: boolean,
  teacherEmail?: string | null,
  limit = DEFAULT_LOGS_LIMIT
): LogsQueryScope {
  if (isAdmin) {
    return { type: 'all', limit };
  }
  return { type: 'by-teacher', teacherEmail: teacherEmail ?? '', limit };
}
