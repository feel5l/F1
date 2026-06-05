import { describe, it, expect } from 'vitest';
import { computeAttendanceStats } from './attendanceStats';

describe('computeAttendanceStats', () => {
  it('counts each attendance status', () => {
    const stats = computeAttendanceStats({
      s1: { status: 'حاضر', note: '' },
      s2: { status: 'غائب', note: '' },
      s3: { status: 'متأخر', note: '' },
      s4: { status: 'بعذر', note: 'موعد طبي' },
      s5: { status: 'حاضر', note: '' },
    });

    expect(stats).toEqual({
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for an empty roster', () => {
    expect(computeAttendanceStats({})).toEqual({
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});
