import { describe, it, expect } from 'vitest';
import { computeAttendanceSummary } from './attendanceStats';
import type { AttendanceStatus } from '../types';

function records(...statuses: AttendanceStatus[]) {
  return statuses.map((status) => ({ status }));
}

describe('computeAttendanceSummary', () => {
  it('counts each status and computes attendance rate', () => {
    const summary = computeAttendanceSummary(
      records('حاضر', 'حاضر', 'غائب', 'متأخر', 'بعذر'),
    );

    expect(summary).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 80,
    });
  });

  it('returns zero rate for empty input', () => {
    expect(computeAttendanceSummary([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });

  it('rounds rate to nearest whole percent', () => {
    const summary = computeAttendanceSummary(records('حاضر', 'غائب', 'غائب'));
    expect(summary.rate).toBe(33);
  });
});
