import { describe, it, expect } from 'vitest';
import { getCsvDataStartIndex, parseStudentCsvRow } from './csvImport';

describe('getCsvDataStartIndex', () => {
  it('skips row when Arabic header is present', () => {
    expect(getCsvDataStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips row when English Name header is present', () => {
    expect(getCsvDataStartIndex('Student Name')).toBe(1);
  });

  it('starts at first row when no header markers', () => {
    expect(getCsvDataStartIndex('أحمد محمد')).toBe(0);
    expect(getCsvDataStartIndex(undefined)).toBe(0);
  });
});

describe('parseStudentCsvRow', () => {
  it('parses a valid row with guardian fields', () => {
    expect(parseStudentCsvRow(['  علي  ', 'والد', '0501234567', 'parent@test.com'])).toEqual({
      fullName: 'علي',
      guardianName: 'والد',
      guardianPhone: '0501234567',
      parentEmail: 'parent@test.com',
    });
  });

  it('returns null for empty name rows', () => {
    expect(parseStudentCsvRow(['', 'x'])).toBeNull();
    expect(parseStudentCsvRow(['   '])).toBeNull();
  });

  it('defaults optional columns to empty strings', () => {
    expect(parseStudentCsvRow(['سارة'])).toEqual({
      fullName: 'سارة',
      guardianName: '',
      guardianPhone: '',
      parentEmail: '',
    });
  });
});
