import { describe, it, expect } from 'vitest';
import {
  calculateReportsAttendanceRate,
  calculateDashboardAttendanceRate,
  detectCsvHeaderStartIndex,
  cleanPhoneNumber,
  buildWhatsAppUrl,
  countAttendanceByStatus,
} from './attendance-stats';

describe('calculateReportsAttendanceRate', () => {
  it('returns 0 when total is zero', () => {
    expect(calculateReportsAttendanceRate(0, 0, 0, 0)).toBe(0);
  });

  it('counts present, late, and excused toward discipline rate', () => {
    expect(calculateReportsAttendanceRate(10, 0, 2, 12)).toBe(100);
    expect(calculateReportsAttendanceRate(8, 1, 1, 12)).toBe(83);
  });
});

describe('calculateDashboardAttendanceRate', () => {
  it('returns 0 when there are no students', () => {
    expect(calculateDashboardAttendanceRate(5, 2, 0)).toBe(0);
  });

  it('uses present and late only over total students', () => {
    expect(calculateDashboardAttendanceRate(8, 2, 20)).toBe(50);
  });
});

describe('detectCsvHeaderStartIndex', () => {
  it('skips Arabic header row', () => {
    expect(detectCsvHeaderStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips English header row', () => {
    expect(detectCsvHeaderStartIndex('Name')).toBe(1);
  });

  it('starts at first row for data rows', () => {
    expect(detectCsvHeaderStartIndex('أحمد محمد')).toBe(0);
    expect(detectCsvHeaderStartIndex(undefined)).toBe(0);
  });
});

describe('cleanPhoneNumber', () => {
  it('removes non-digit characters', () => {
    expect(cleanPhoneNumber('+966 50-123-4567')).toBe('966501234567');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds encoded wa.me link', () => {
    const url = buildWhatsAppUrl('0501234567', 'مرحباً');
    expect(url).toBe('https://wa.me/0501234567?text=' + encodeURIComponent('مرحباً'));
  });
});

describe('countAttendanceByStatus', () => {
  it('aggregates attendance statuses', () => {
    const result = countAttendanceByStatus(['حاضر', 'غائب', 'متأخر', 'بعذر', 'حاضر']);
    expect(result).toEqual({
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      total: 5,
    });
  });
});
