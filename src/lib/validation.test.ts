import { describe, expect, it } from 'vitest';
import {
  ATTENDANCE_STATUSES,
  isValidAttendanceStatus,
  isValidDocumentId,
  isValidPeriod,
} from './validation';

describe('isValidDocumentId', () => {
  it('accepts safe Firestore-style IDs', () => {
    expect(isValidDocumentId('student_1')).toBe(true);
    expect(isValidDocumentId('class-2A')).toBe(true);
  });

  it('rejects empty, oversized, or unsafe IDs', () => {
    expect(isValidDocumentId('')).toBe(false);
    expect(isValidDocumentId('a'.repeat(129))).toBe(false);
    expect(isValidDocumentId('bad/id')).toBe(false);
    expect(isValidDocumentId('spaces not allowed')).toBe(false);
  });
});

describe('isValidAttendanceStatus', () => {
  it('accepts the four supported attendance states', () => {
    for (const status of ATTENDANCE_STATUSES) {
      expect(isValidAttendanceStatus(status)).toBe(true);
    }
  });

  it('rejects unknown statuses', () => {
    expect(isValidAttendanceStatus('مغادر')).toBe(false);
  });
});

describe('isValidPeriod', () => {
  it('accepts school periods between 1 and 10', () => {
    expect(isValidPeriod(1)).toBe(true);
    expect(isValidPeriod(10)).toBe(true);
  });

  it('rejects invalid periods', () => {
    expect(isValidPeriod(0)).toBe(false);
    expect(isValidPeriod(11)).toBe(false);
    expect(isValidPeriod(2.5)).toBe(false);
  });
});
