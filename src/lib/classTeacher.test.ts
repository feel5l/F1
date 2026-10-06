import { describe, it, expect } from 'vitest';
import { normalizeTeacherEmailSelection } from './classTeacher';

describe('normalizeTeacherEmailSelection', () => {
  it('clears teacherEmail when "none" is selected', () => {
    expect(normalizeTeacherEmailSelection('none')).toBe('');
  });

  it('preserves staff email values', () => {
    expect(normalizeTeacherEmailSelection('teacher@ghiabi.com')).toBe('teacher@ghiabi.com');
  });
});
