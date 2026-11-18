import { describe, it, expect } from 'vitest';
import { filterClassesForAttendanceView } from './classScope';

const classes = [
  { id: 'a', teacherEmail: 't1@ghiabi.com' },
  { id: 'b', teacherEmail: 't2@ghiabi.com' },
];

describe('filterClassesForAttendanceView', () => {
  it('returns all classes when user may view all', () => {
    expect(filterClassesForAttendanceView(classes, true, undefined, 't1@ghiabi.com')).toHaveLength(2);
    expect(
      filterClassesForAttendanceView(classes, false, 'ATTENDANCE_OFFICER', 't1@ghiabi.com')
    ).toHaveLength(2);
  });

  it('scopes plain teachers to their classes', () => {
    expect(filterClassesForAttendanceView(classes, false, 'TEACHER', 't1@ghiabi.com')).toEqual([
      classes[0],
    ]);
  });

  it('returns empty when teacher email is missing', () => {
    expect(filterClassesForAttendanceView(classes, false, 'TEACHER', null)).toEqual([]);
  });
});
