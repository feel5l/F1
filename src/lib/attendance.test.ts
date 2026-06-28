import { describe, expect, it } from 'vitest';
import { AttendanceStatus } from '../types';
import {
  calculateDashboardAttendanceRate,
  calculateReportAttendanceRate,
  countAttendanceStatuses,
} from './attendance';

const sampleStatuses: AttendanceStatus[] = [
  'حاضر',
  'حاضر',
  'غائب',
  'متأخر',
  'بعذر',
];

describe('countAttendanceStatuses', () => {
  it('counts each attendance state', () => {
    expect(countAttendanceStatuses(sampleStatuses)).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for an empty list', () => {
    expect(countAttendanceStatuses([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});

describe('calculateReportAttendanceRate', () => {
  it('treats present, late, and excused as successful attendance', () => {
    expect(
      calculateReportAttendanceRate({
        total: 5,
        present: 2,
        late: 1,
        excused: 1,
      }),
    ).toBe(80);
  });

  it('returns zero when there are no logs', () => {
    expect(
      calculateReportAttendanceRate({
        total: 0,
        present: 0,
        late: 0,
        excused: 0,
      }),
    ).toBe(0);
  });
});

describe('calculateDashboardAttendanceRate', () => {
  it('measures attendance against enrolled students', () => {
    expect(calculateDashboardAttendanceRate(18, 2, 20)).toBe(100);
    expect(calculateDashboardAttendanceRate(15, 0, 20)).toBe(75);
  });

  it('returns zero when there are no students', () => {
    expect(calculateDashboardAttendanceRate(0, 0, 0)).toBe(0);
  });
});
