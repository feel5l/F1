import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard: bulk student CSV import must use shared preflight/parsers
 * so bad files fail fast and row shape stays aligned with Firestore rules.
 */
describe('Students.tsx CSV import wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Students.tsx'), 'utf8');

  it('validates class + file before Papa.parse', () => {
    expect(source).toMatch(/validateStudentImportPreflight\(importClassId, file\)/);
    expect(source).toMatch(/csvImportStartIndex/);
    expect(source).toMatch(/parseStudentImportRow/);
  });

  it('writes active students with class context from selected import class', () => {
    expect(source).toMatch(/classId: importClassId/);
    expect(source).toMatch(/className: selectedClass\?\.name/);
    expect(source).toMatch(/isActive: true/);
  });

  it('resets file input after import attempts', () => {
    expect(source).toMatch(/event\.target\.value = ''/);
  });

  it('routes student mutations through shared form validation and Firestore error helper', () => {
    expect(source).toMatch(/validateStudentForm\(formData\)/);
    expect(source).toMatch(/handleFirestoreError\(err, OperationType/);
  });
});