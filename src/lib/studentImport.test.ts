import { describe, it, expect } from 'vitest';
import {
  getCsvImportStartIndex,
  parseStudentCsvRow,
  parseStudentCsvRows,
} from './studentImport';

describe('getCsvImportStartIndex', () => {
  it('skips Arabic header row', () => {
    expect(getCsvImportStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips English header row', () => {
    expect(getCsvImportStartIndex('Student Name')).toBe(1);
  });

  it('starts at first row when no header detected', () => {
    expect(getCsvImportStartIndex('أحمد')).toBe(0);
  });
});

describe('parseStudentCsvRow', () => {
  it('maps columns and trims values', () => {
    expect(
      parseStudentCsvRow(['  أحمد  ', ' ولي ', ' 050 ', 'parent@test.com'])
    ).toEqual({
      fullName: 'أحمد',
      guardianName: 'ولي',
      guardianPhone: '050',
      parentEmail: 'parent@test.com',
    });
  });

  it('returns null for empty name', () => {
    expect(parseStudentCsvRow(['', 'x'])).toBeNull();
  });
});

describe('parseStudentCsvRows', () => {
  it('parses multiple data rows after header offset', () => {
    const data = [
      ['الاسم', 'ولي الأمر'],
      ['أحمد', 'محمد', '050'],
      ['', 'ignored'],
      ['فاطمة', 'علي'],
    ];
    const rows = parseStudentCsvRows(data, getCsvImportStartIndex(data[0][0]));
    expect(rows).toHaveLength(2);
    expect(rows[0].fullName).toBe('أحمد');
    expect(rows[1].fullName).toBe('فاطمة');
  });
});
