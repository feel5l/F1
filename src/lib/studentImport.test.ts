import { describe, it, expect } from 'vitest';
import { detectStudentCsvStartIndex, parseStudentCsvRow } from './studentImport';

describe('detectStudentCsvStartIndex', () => {
  it('skips Arabic header row', () => {
    expect(detectStudentCsvStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips English header row', () => {
    expect(detectStudentCsvStartIndex('Name')).toBe(1);
  });

  it('starts at 0 when first cell is a student name', () => {
    expect(detectStudentCsvStartIndex('أحمد محمد')).toBe(0);
    expect(detectStudentCsvStartIndex(undefined)).toBe(0);
  });
});

describe('parseStudentCsvRow', () => {
  it('parses a complete row', () => {
    expect(parseStudentCsvRow(['  أحمد  ', ' ولي ', ' 050123 ', ' parent@test.com '])).toEqual({
      name: 'أحمد',
      guardianName: 'ولي',
      guardianPhone: '050123',
      parentEmail: 'parent@test.com',
    });
  });

  it('returns null for empty name rows', () => {
    expect(parseStudentCsvRow(['', 'guardian'])).toBeNull();
    expect(parseStudentCsvRow(['   '])).toBeNull();
  });

  it('defaults missing optional fields to empty strings', () => {
    expect(parseStudentCsvRow(['سارة'])).toEqual({
      name: 'سارة',
      guardianName: '',
      guardianPhone: '',
      parentEmail: '',
    });
  });
});
