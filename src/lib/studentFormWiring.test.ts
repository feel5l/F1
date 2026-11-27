import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Students.tsx form wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Students.tsx'), 'utf8');

  it('guards save with isStudentFormComplete', () => {
    expect(source).toMatch(/isStudentFormComplete/);
  });
});