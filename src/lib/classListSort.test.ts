import { describe, it, expect } from 'vitest';
import { sortClassesByArabicName } from './classListSort';
import type { Class } from '../types';

const base = (name: string): Class => ({
  id: name,
  name,
  gradeLevel: '1',
});

describe('sortClassesByArabicName', () => {
  it('sorts by Arabic locale without mutating input', () => {
    const input = [base('ب'), base('أ'), base('ج')];
    const sorted = sortClassesByArabicName(input);
    expect(sorted.map((c) => c.name)).toEqual(['أ', 'ب', 'ج']);
    expect(input.map((c) => c.name)).toEqual(['ب', 'أ', 'ج']);
  });
});