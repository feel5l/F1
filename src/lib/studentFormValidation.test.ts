import { describe, it, expect } from 'vitest';
import { isStudentFormComplete } from './studentFormValidation';

describe('isStudentFormComplete', () => {
  it('requires non-empty name and class', () => {
    expect(isStudentFormComplete('أحمد', 'class-1')).toBe(true);
    expect(isStudentFormComplete('  أحمد  ', 'class-1')).toBe(true);
  });

  it('rejects missing name or class', () => {
    expect(isStudentFormComplete('', 'class-1')).toBe(false);
    expect(isStudentFormComplete('   ', 'class-1')).toBe(false);
    expect(isStudentFormComplete('أحمد', '')).toBe(false);
    expect(isStudentFormComplete('أحمد', '   ')).toBe(false);
  });
});