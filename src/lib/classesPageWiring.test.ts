import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: class admin must keep teacher assignment helpers and Firestore error routing. */
describe('Classes.tsx teacher assignment wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Classes.tsx'), 'utf8');

  it('sorts roster and normalizes teacher select values via classAdmin helpers', () => {
    expect(source).toMatch(/from '\.\.\/lib\/classAdmin'/);
    expect(source).toMatch(/sortClassesByArabicName\(list\)/);
    expect(source).toMatch(/coerceTeacherEmailSelect\(val\)/);
  });

  it('persists teacherEmail updates and routes failures through handleFirestoreError', () => {
    expect(source).toMatch(/teacherEmail: editingClass\.teacherEmail/);
    expect(source).toMatch(/updateDoc\(classRef/);
    expect(source).toMatch(/handleFirestoreError\(err, OperationType\.UPDATE, 'classes'\)/);
    expect(source).toMatch(/handleFirestoreError\(err, OperationType\.DELETE, 'classes'\)/);
  });

  it('does not inline Arabic sort or "none" sentinel logic in the page', () => {
    expect(source).not.toMatch(/localeCompare\(.*'ar'/);
    expect(source).not.toMatch(/val === 'none' \? ''/);
  });
});