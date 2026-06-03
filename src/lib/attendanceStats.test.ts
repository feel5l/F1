import { describe, it, expect } from 'vitest';
import { calculateAttendanceStats } from './attendanceStats';
import type { AttendanceStatus } from '../types';

function logs(...statuses: AttendanceStatus[]) {
  return statuses.map((status) => ({ status }));
}

describe('calculateAttendanceStats', () => {
  it('returns zeros and 0% rate for empty logs', () => {
    expect(calculateAttendanceStats([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });

  it('counts each status and rounds attendance rate', () => {
    const stats = calculateAttendanceStats(
      logs('حاضر', 'حاضر', 'غائب', 'متأخر', 'بعذر')
    );
    expect(stats).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 80,
    });
  });

  it('treats only absent records as 0% attendance', () => {
    expect(calculateAttendanceStats(logs('غائب', 'غائب')).rate).toBe(0);
  });
});
