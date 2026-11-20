import { describe, it, expect } from 'vitest';
import { coerceTeacherEmailSelect, sortClassesByArabicName } from './classAdmin';

describe('coerceTeacherEmailSelect', () => {
  it('maps none sentinel to empty email', () => {
    expect(coerceTeacherEmailSelect('none')).toBe('');
    expect(coerceTeacherEmailSelect('t@ghiabi.com')).toBe('t@ghiabi.com');
  });
});

describe('sortClassesByArabicName', () => {
  it('orders by Arabic locale without mutating input', () => {
    const input = [{ name: 'ثانوي', id: 'b' }, { name: 'أول', id: 'a' }];
    const sorted = sortClassesByArabicName(input);
    expect(sorted[0].name).toBe('أول');
    expect(input[0].name).toBe('ثانوي');
  });
});