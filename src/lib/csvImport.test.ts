import { describe, it, expect } from 'vitest';
import { getCsvImportStartIndex } from './csvImport';

describe('getCsvImportStartIndex', () => {
  it('skips row when header uses Arabic name column', () => {
    expect(getCsvImportStartIndex('الاسم الكامل')).toBe(1);
  });

  it('skips row when header uses English Name', () => {
    expect(getCsvImportStartIndex('Student Name')).toBe(1);
  });

  it('starts at first row for data without header markers', () => {
    expect(getCsvImportStartIndex('أحمد محمد')).toBe(0);
    expect(getCsvImportStartIndex(undefined)).toBe(0);
  });
});
