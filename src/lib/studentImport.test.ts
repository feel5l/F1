import { describe, expect, it } from 'vitest';
import { detectStudentCsvStartIndex, parseStudentCsvRow } from './studentImport';

describe('detectStudentCsvStartIndex', () => {
  it('skips Arabic header rows', () => {
    expect(detectStudentCsvStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips English header rows', () => {
    expect(detectStudentCsvStartIndex('Student Name')).toBe(1);
  });

  it('starts at zero for data rows', () => {
    expect(detectStudentCsvStartIndex('أحمد علي')).toBe(0);
    expect(detectStudentCsvStartIndex(undefined)).toBe(0);
  });
});

describe('parseStudentCsvRow', () => {
  it('parses a full student row', () => {
    expect(parseStudentCsvRow(['  أحمد علي  ', 'ولي الأمر', '0501234567', 'parent@mail.com'])).toEqual({
      name: 'أحمد علي',
      guardianName: 'ولي الأمر',
      guardianPhone: '0501234567',
      parentEmail: 'parent@mail.com',
    });
  });

  it('returns null for empty name rows', () => {
    expect(parseStudentCsvRow(['', 'guardian'])).toBeNull();
    expect(parseStudentCsvRow(['   '])).toBeNull();
  });

  it('defaults optional columns to empty strings', () => {
    expect(parseStudentCsvRow(['سارة'])).toEqual({
      name: 'سارة',
      guardianName: '',
      guardianPhone: '',
      parentEmail: '',
    });
  });
});
