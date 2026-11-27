import { describe, it, expect } from 'vitest';
import { sortClassesByArabicName } from './classListSort';

describe('sortClassesByArabicName', () => {
  it('sorts by Arabic locale rules without mutating input', () => {
    const input = [{ name: 'فصل ب' }, { name: 'فصل أ' }, { name: 'فصل ج' }];
    const expected = [...input].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    const sorted = sortClassesByArabicName(input);
    expect(sorted).toEqual(expected);
    expect(input.map((c) => c.name)).toEqual(['فصل ب', 'فصل أ', 'فصل ج']);
  });
});