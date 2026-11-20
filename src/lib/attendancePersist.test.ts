import { describe, it, expect } from 'vitest';
import { buildAttendanceLogWrites } from './attendancePersist';

describe('buildAttendanceLogWrites', () => {
  it('maps each student to a log row with session and class context', () => {
    const rows = buildAttendanceLogWrites(
      {
        s1: { status: 'حاضر', note: '' },
        s2: { status: 'غائب', note: 'مرض' },
      },
      { sessionId: 'sess-1', classId: 'class-9', teacherEmail: 't@ghiabi.com' }
    );

    expect(rows).toHaveLength(2);
    expect(rows).toContainEqual({
      studentId: 's1',
      sessionId: 'sess-1',
      classId: 'class-9',
      teacherEmail: 't@ghiabi.com',
      status: 'حاضر',
      note: '',
    });
    expect(rows).toContainEqual({
      studentId: 's2',
      sessionId: 'sess-1',
      classId: 'class-9',
      teacherEmail: 't@ghiabi.com',
      status: 'غائب',
      note: 'مرض',
    });
  });

  it('returns no rows when attendance map is empty', () => {
    expect(
      buildAttendanceLogWrites({}, { sessionId: 'x', classId: 'c', teacherEmail: 't@ghiabi.com' })
    ).toEqual([]);
  });
});