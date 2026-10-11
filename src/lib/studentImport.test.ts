import { describe, it, expect } from 'vitest';
import {
  detectStudentCsvStartIndex,
  parseStudentCsvRow,
  countImportableStudentRows,
  validateStudentImportClassSelected,
  resolveStudentImportClassName,
  buildStudentImportRecord,
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

describe('validateStudentImportClassSelected', () => {
  it('requires a non-empty class id before import', () => {
    expect(validateStudentImportClassSelected('')).toBe('يرجى اختيار الفصل أولاً');
    expect(validateStudentImportClassSelected('   ')).toBe('يرجى اختيار الفصل أولاً');
  });

  it('accepts a selected class id', () => {
    expect(validateStudentImportClassSelected('class-1')).toBeNull();
  });
});

describe('resolveStudentImportClassName', () => {
  it('resolves the class display name from the live list', () => {
    expect(
      resolveStudentImportClassName(
        [{ id: 'c1', name: 'الثالث 1' }],
        'c1'
      )
    ).toBe('الثالث 1');
  });

  it('returns empty string when class id is unknown', () => {
    expect(resolveStudentImportClassName([], 'missing')).toBe('');
  });
});

describe('buildStudentImportRecord', () => {
  it('maps parsed CSV fields to the Firestore student shape', () => {
    expect(
      buildStudentImportRecord(
        {
          name: 'أحمد',
          guardianName: 'ولي',
          guardianPhone: '050',
          parentEmail: 'parent@test.com',
        },
        'c1',
        'الثالث 1'
      )
    ).toEqual({
      fullName: 'أحمد',
      classId: 'c1',
      className: 'الثالث 1',
      guardianName: 'ولي',
      guardianPhone: '050',
      parentEmail: 'parent@test.com',
      isActive: true,
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
