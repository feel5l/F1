import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const studentsSource = readFileSync(path.join(__dirname, '../pages/Students.tsx'), 'utf8');

describe('Students CSV import wiring', () => {
  it('uses shared CSV header and row parsers', () => {
    expect(studentsSource).toContain('csvImportStartIndex');
    expect(studentsSource).toContain('parseStudentImportRow');
  });
});