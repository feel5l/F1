import { describe, it, expect } from 'vitest';
import { parseAttendancePeriod, validateAttendanceSubmit } from './attendanceSession';

describe('validateAttendanceSubmit', () => {
  it('requires class, subject, and teacher email', () => {
    expect(
      validateAttendanceSubmit({
        selectedClass: 'c1',
        subject: 'رياضيات',
        teacherEmail: 't@ghiabi.com',
      })
    ).toBe(true);
  });

  it('rejects missing or blank fields', () => {
    expect(
      validateAttendanceSubmit({ selectedClass: '', subject: 'x', teacherEmail: 't@ghiabi.com' })
    ).toBe(false);
    expect(
      validateAttendanceSubmit({ selectedClass: 'c1', subject: '  ', teacherEmail: 't@ghiabi.com' })
    ).toBe(false);
    expect(validateAttendanceSubmit({ selectedClass: 'c1', subject: 'x', teacherEmail: null })).toBe(
      false
    );
  });
});

describe('parseAttendancePeriod', () => {
  it('parses numeric periods', () => {
    expect(parseAttendancePeriod('3')).toBe(3);
  });

  it('falls back to 2 for invalid input', () => {
    expect(parseAttendancePeriod('')).toBe(2);
    expect(parseAttendancePeriod('abc')).toBe(2);
    expect(parseAttendancePeriod('0')).toBe(2);
  });
});
