import { describe, it, expect } from 'vitest';
import { isValidId, isValidAttendanceStatus, isValidStudent, isValidLog } from './validation';

describe('isValidId', () => {
  it('accepts alphanumeric ids with underscore and hyphen', () => {
    expect(isValidId('student_1')).toBe(true);
    expect(isValidId('class-2A')).toBe(true);
  });

  it('rejects empty, oversized, or poisoned ids', () => {
    expect(isValidId('')).toBe(false);
    expect(isValidId('a'.repeat(129))).toBe(false);
    expect(isValidId('id with spaces')).toBe(false);
    expect(isValidId('../../../etc/passwd')).toBe(false);
  });
});

describe('isValidAttendanceStatus', () => {
  it('accepts the four Arabic status values', () => {
    expect(isValidAttendanceStatus('حاضر')).toBe(true);
    expect(isValidAttendanceStatus('غائب')).toBe(true);
    expect(isValidAttendanceStatus('متأخر')).toBe(true);
    expect(isValidAttendanceStatus('بعذر')).toBe(true);
  });

  it('rejects injected status values', () => {
    expect(isValidAttendanceStatus('سحب')).toBe(false);
    expect(isValidAttendanceStatus('present')).toBe(false);
    expect(isValidAttendanceStatus('')).toBe(false);
  });
});

describe('isValidStudent', () => {
  const validStudent = {
    fullName: 'أحمد',
    classId: 'class_1',
    className: '1أ',
    guardianName: 'ولي',
    guardianPhone: '0501234567',
    isActive: true,
  };

  it('accepts valid student payloads', () => {
    expect(isValidStudent(validStudent)).toBe(true);
  });

  it('rejects missing name or invalid class id', () => {
    expect(isValidStudent({ ...validStudent, fullName: '' })).toBe(false);
    expect(isValidStudent({ ...validStudent, classId: 'bad id!' })).toBe(false);
    expect(isValidStudent({ ...validStudent, fullName: 'x'.repeat(201) })).toBe(false);
  });
});

describe('isValidLog', () => {
  const validLog = {
    studentId: 'stu_1',
    sessionId: 'sess_1',
    classId: 'class_1',
    teacherEmail: 'teacher@ghiabi.com',
    status: 'غائب',
  };

  it('accepts valid attendance log payloads', () => {
    expect(isValidLog(validLog)).toBe(true);
  });

  it('rejects invalid ids or status injection', () => {
    expect(isValidLog({ ...validLog, studentId: '' })).toBe(false);
    expect(isValidLog({ ...validLog, status: 'سحب' })).toBe(false);
  });
});
