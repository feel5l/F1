import { describe, it, expect } from 'vitest';
import {
  shouldFilterAttendanceByTeacherEmail,
  usesSchoolWideAttendanceLogQuery,
} from './teacherDataScope';

describe('shouldFilterAttendanceByTeacherEmail', () => {
  it('never scopes admins to a teacher email', () => {
    expect(shouldFilterAttendanceByTeacherEmail(true, 'teacher@ghiabi.com')).toBe(false);
    expect(shouldFilterAttendanceByTeacherEmail(true, undefined)).toBe(false);
  });

  it('scopes teachers when email is present', () => {
    expect(shouldFilterAttendanceByTeacherEmail(false, 'teacher@ghiabi.com')).toBe(true);
  });

  it('does not apply teacher filter when email is missing (matches Dashboard/Reports)', () => {
    expect(shouldFilterAttendanceByTeacherEmail(false, undefined)).toBe(false);
    expect(shouldFilterAttendanceByTeacherEmail(false, null)).toBe(false);
    expect(shouldFilterAttendanceByTeacherEmail(false, '')).toBe(false);
  });
});

describe('usesSchoolWideAttendanceLogQuery', () => {
  it('allows school-wide log fetch for admins only', () => {
    expect(usesSchoolWideAttendanceLogQuery(true)).toBe(true);
    expect(usesSchoolWideAttendanceLogQuery(false)).toBe(false);
  });
});