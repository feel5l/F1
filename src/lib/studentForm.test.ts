import { describe, it, expect } from 'vitest';
import { validateStudentForm } from './studentForm';

describe('validateStudentForm', () => {
  it('requires name and class', () => {
    expect(validateStudentForm({ fullName: 'أحمد', classId: 'c1' })).toBe(true);
  });

  it('rejects blank trimmed fields', () => {
    expect(validateStudentForm({ fullName: '  ', classId: 'c1' })).toBe(false);
    expect(validateStudentForm({ fullName: 'أحمد', classId: '' })).toBe(false);
  });
});