import { describe, expect, it } from 'vitest';
import { AttendanceStatus } from '../types';
import { calculateDisciplineRate, countAttendanceByStatus } from './attendance';

describe('countAttendanceByStatus', () => {
  it('counts each supported attendance status', () => {
    const statuses: AttendanceStatus[] = ['حاضر', 'حاضر', 'غائب', 'متأخر', 'بعذر'];

    expect(countAttendanceByStatus(statuses)).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for an empty list', () => {
    expect(countAttendanceByStatus([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});

describe('calculateDisciplineRate', () => {
  it('treats present, late, and excused as compliant attendance', () => {
    expect(
      calculateDisciplineRate({
        total: 4,
        present: 2,
        late: 1,
        excused: 1,
      }),
    ).toBe(100);
  });

  it('rounds the percentage to the nearest whole number', () => {
    expect(
      calculateDisciplineRate({
        total: 3,
        present: 2,
        late: 0,
        excused: 0,
      }),
    ).toBe(67);
  });

  it('returns zero when there are no records', () => {
    expect(
      calculateDisciplineRate({
        total: 0,
        present: 0,
        late: 0,
        excused: 0,
      }),
    ).toBe(0);
  });
});
