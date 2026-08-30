import { describe, it, expect } from 'vitest';
import { detectCsvStartIndex } from './csvImport';

describe('detectCsvStartIndex', () => {
  it('returns 1 when first cell contains Arabic header marker', () => {
    expect(detectCsvStartIndex('الاسم الكامل')).toBe(1);
    expect(detectCsvStartIndex('الاسم')).toBe(1);
  });

  it('returns 1 when first cell contains English header marker', () => {
    expect(detectCsvStartIndex('Name')).toBe(1);
    expect(detectCsvStartIndex('Student Name')).toBe(1);
  });

  it('returns 0 for data rows or empty input', () => {
    expect(detectCsvStartIndex('أحمد محمد')).toBe(0);
    expect(detectCsvStartIndex(undefined)).toBe(0);
    expect(detectCsvStartIndex('')).toBe(0);
  });
});
