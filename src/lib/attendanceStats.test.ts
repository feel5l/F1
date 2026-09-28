import { describe, it, expect } from 'vitest';
import { calculateAttendanceStats } from './attendanceStats';
import { AttendanceStatus } from '../types';

describe('calculateAttendanceStats', () => {
  it('computes counts and compliance rate', () => {
    const statuses: AttendanceStatus[] = [
      'حاضر',
      'حاضر',
      'غائب',
      'متأخر',
      'بعذر',
    ];

    expect(calculateAttendanceStats(statuses)).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 80,
    });
  });

  it('returns zero rate for empty input', () => {
    expect(calculateAttendanceStats([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });

  it('rounds compliance rate to whole percent', () => {
    const statuses: AttendanceStatus[] = ['حاضر', 'غائب', 'غائب'];
    expect(calculateAttendanceStats(statuses).rate).toBe(33);
  });
});
