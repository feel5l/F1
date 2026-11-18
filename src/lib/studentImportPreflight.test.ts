import { describe, it, expect } from 'vitest';
import { validateStudentImportPreflight } from './studentImportPreflight';

describe('validateStudentImportPreflight', () => {
  const file = new File(['a'], 'students.csv', { type: 'text/csv' });

  it('passes when class and file are present', () => {
    expect(validateStudentImportPreflight('class-1', file)).toEqual({ ok: true });
  });

  it('requires a selected class', () => {
    expect(validateStudentImportPreflight('', file)).toEqual({ ok: false, error: 'missing_class' });
    expect(validateStudentImportPreflight('   ', file)).toEqual({ ok: false, error: 'missing_class' });
  });

  it('requires a file', () => {
    expect(validateStudentImportPreflight('class-1', null)).toEqual({ ok: false, error: 'missing_file' });
    expect(validateStudentImportPreflight('class-1', undefined)).toEqual({
      ok: false,
      error: 'missing_file',
    });
  });
});