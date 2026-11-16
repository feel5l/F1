import { describe, it, expect } from 'vitest';
import { validateStudentImportPreflight } from './studentImportPreflight';

describe('validateStudentImportPreflight', () => {
  const file = new File(['a'], 'students.csv', { type: 'text/csv' });

  it('requires a class before import', () => {
    expect(validateStudentImportPreflight('', file)).toEqual({
      ok: false,
      reason: 'missing-class',
    });
    expect(validateStudentImportPreflight('   ', file)).toEqual({
      ok: false,
      reason: 'missing-class',
    });
  });

  it('requires a selected file', () => {
    expect(validateStudentImportPreflight('class-1', undefined)).toEqual({
      ok: false,
      reason: 'missing-file',
    });
    expect(validateStudentImportPreflight('class-1', null)).toEqual({
      ok: false,
      reason: 'missing-file',
    });
  });

  it('allows import when class and file are present', () => {
    expect(validateStudentImportPreflight('class-1', file)).toEqual({ ok: true });
  });
});