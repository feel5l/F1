import { describe, it, expect } from 'vitest';
import { createInitialAttendance, computeAttendanceStats } from './attendance';

describe('createInitialAttendance', () => {
  it('defaults every student to present with empty note', () => {
    const result = createInitialAttendance(['s1', 's2']);
    expect(result).toEqual({
      s1: { status: 'حاضر', note: '' },
      s2: { status: 'حاضر', note: '' },
    });
  });

  it('returns empty object for no students', () => {
    expect(createInitialAttendance([])).toEqual({});
  });
});

describe('computeAttendanceStats', () => {
  it('counts each attendance status correctly', () => {
    const stats = computeAttendanceStats({
      s1: { status: 'حاضر', note: '' },
      s2: { status: 'غائب', note: '' },
      s3: { status: 'متأخر', note: '' },
      s4: { status: 'بعذر', note: 'مرض' },
      s5: { status: 'حاضر', note: '' },
    });

    expect(stats).toEqual({
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
    });
  });

  it('returns zeros for empty attendance', () => {
    expect(computeAttendanceStats({})).toEqual({
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    });
  });
});
