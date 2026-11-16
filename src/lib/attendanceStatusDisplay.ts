import type { AttendanceStatus } from '../types';

export type AttendanceStatusTone = 'present' | 'absent' | 'late' | 'excused' | 'unknown';

export interface AttendanceStatusDisplay {
  label: string;
  tone: AttendanceStatusTone;
  badgeClassName: string;
  destructive?: boolean;
  outline?: boolean;
}

const KNOWN: Record<AttendanceStatus, AttendanceStatusDisplay> = {
  حاضر: {
    label: 'حاضر',
    tone: 'present',
    badgeClassName: 'bg-green-600',
  },
  غائب: {
    label: 'غائب',
    tone: 'absent',
    badgeClassName: '',
    destructive: true,
  },
  متأخر: {
    label: 'متأخر',
    tone: 'late',
    badgeClassName: 'bg-orange-500',
  },
  بعذر: {
    label: 'بعذر',
    tone: 'excused',
    badgeClassName: 'bg-blue-500',
  },
};

export function isKnownAttendanceStatus(status: string): status is AttendanceStatus {
  return status in KNOWN;
}

/** Maps log status strings to UI badge styling (Logs page). */
export function resolveAttendanceStatusDisplay(status: string): AttendanceStatusDisplay {
  if (isKnownAttendanceStatus(status)) {
    return KNOWN[status];
  }
  return {
    label: status,
    tone: 'unknown',
    badgeClassName: '',
    outline: true,
  };
}