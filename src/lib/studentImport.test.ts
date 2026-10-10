import { describe, it, expect } from 'vitest';
import {
  detectStudentCsvStartIndex,
  parseStudentCsvRow,
  countImportableStudentRows,
} from './studentImport';

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

describe('countImportableStudentRows', () => {
  it('skips header row and blank name rows', () => {
    const rows = [
      ['الاسم الكامل', 'ولي الأمر'],
      ['أحمد', 'ولي 1'],
      ['', 'ignored'],
      ['سارة', 'ولي 2'],
    ];
    expect(countImportableStudentRows(rows)).toBe(2);
  });

  it('counts from row 0 when there is no header', () => {
    expect(
      countImportableStudentRows([
        ['طالب 1'],
        ['   '],
        ['طالب 2'],
      ])
    ).toBe(2);
  });
});
