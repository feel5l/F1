import { describe, it, expect } from 'vitest';
import { csvImportStartIndex, parseStudentImportRow } from './studentImport';

describe('csvImportStartIndex', () => {
  it('skips header row when Arabic or English name column is detected', () => {
    expect(csvImportStartIndex('الاسم الكامل')).toBe(1);
    expect(csvImportStartIndex('Student Name')).toBe(1);
    expect(csvImportStartIndex('أحمد')).toBe(0);
  });
});

describe('parseStudentImportRow', () => {
  it('maps columns and trims fields', () => {
    expect(parseStudentImportRow(['  سارة  ', ' والد ', ' 050 ', 'a@b.com '])).toEqual({
      fullName: 'سارة',
      guardianName: 'والد',
      guardianPhone: '050',
      parentEmail: 'a@b.com',
    });
  });

  it('returns null for empty name rows', () => {
    expect(parseStudentImportRow(['', 'x'])).toBeNull();
    expect(parseStudentImportRow(['   '])).toBeNull();
  });
});
