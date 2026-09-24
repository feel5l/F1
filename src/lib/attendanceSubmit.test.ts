import { describe, it, expect } from 'vitest';
import {
  validateAttendanceSubmission,
  buildSessionPayload,
  buildAttendanceLogPayload,
} from './attendanceSubmit';

describe('validateAttendanceSubmission', () => {
  it('returns null when all required fields are present', () => {
    expect(
      validateAttendanceSubmission({
        classId: 'class-1',
        subject: 'رياضيات',
        userEmail: 'teacher@ghiabi.com',
      })
    ).toBeNull();
  });

  it('rejects missing classId', () => {
    expect(
      validateAttendanceSubmission({
        classId: '',
        subject: 'رياضيات',
        userEmail: 'teacher@ghiabi.com',
      })
    ).toBe('يرجى ملء كافة البيانات');
  });

  it('rejects missing subject', () => {
    expect(
      validateAttendanceSubmission({
        classId: 'class-1',
        subject: '',
        userEmail: 'teacher@ghiabi.com',
      })
    ).toBe('يرجى ملء كافة البيانات');
  });

  it('rejects missing user email', () => {
    expect(
      validateAttendanceSubmission({
        classId: 'class-1',
        subject: 'رياضيات',
        userEmail: undefined,
      })
    ).toBe('يرجى ملء كافة البيانات');
  });
});

describe('buildSessionPayload', () => {
  it('parses period as integer', () => {
    expect(
      buildSessionPayload('c1', 'علوم', '3', 't@ghiabi.com')
    ).toEqual({
      period: 3,
      subject: 'علوم',
      classId: 'c1',
      teacherEmail: 't@ghiabi.com',
    });
  });
});

describe('buildAttendanceLogPayload', () => {
  it('includes all required log fields', () => {
    expect(
      buildAttendanceLogPayload(
        's1',
        'sess1',
        'c1',
        't@ghiabi.com',
        'غائب',
        'مرض'
      )
    ).toEqual({
      studentId: 's1',
      sessionId: 'sess1',
      classId: 'c1',
      teacherEmail: 't@ghiabi.com',
      status: 'غائب',
      note: 'مرض',
    });
  });
});
