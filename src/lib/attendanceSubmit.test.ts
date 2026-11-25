import { describe, it, expect } from 'vitest';
import { canSubmitAttendanceSession } from './attendanceSubmit';

describe('canSubmitAttendanceSession', () => {
  it('requires class, subject, and teacher email', () => {
    expect(canSubmitAttendanceSession('class-1', 'رياضيات', 'teacher@ghiabi.com')).toBe(true);
  });

  it('rejects missing or blank fields', () => {
    expect(canSubmitAttendanceSession('', 'رياضيات', 'teacher@ghiabi.com')).toBe(false);
    expect(canSubmitAttendanceSession('class-1', '   ', 'teacher@ghiabi.com')).toBe(false);
    expect(canSubmitAttendanceSession('class-1', 'رياضيات', undefined)).toBe(false);
    expect(canSubmitAttendanceSession('class-1', 'رياضيات', '  ')).toBe(false);
  });
});