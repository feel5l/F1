import type { AttendanceStatus } from '../types';

export type AttendanceBadgeVariant = 'success' | 'destructive' | 'warning' | 'info' | 'outline';

export interface AttendanceStatusDisplay {
  label: string;
  variant: AttendanceBadgeVariant;
}

const KNOWN_STATUSES: Record<AttendanceStatus, AttendanceStatusDisplay> = {
  'حاضر': { label: 'حاضر', variant: 'success' },
  'غائب': { label: 'غائب', variant: 'destructive' },
  'متأخر': { label: 'متأخر', variant: 'warning' },
  'بعذر': { label: 'بعذر', variant: 'info' },
};

/** Maps attendance status strings to UI badge styling (Logs page). */
export function resolveAttendanceStatusDisplay(status: string): AttendanceStatusDisplay {
  const known = KNOWN_STATUSES[status as AttendanceStatus];
  if (known) return known;
  return { label: status, variant: 'outline' };
}