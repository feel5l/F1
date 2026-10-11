import { Class, Student } from '../types';

export interface ParsedStudentRow {
  name: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail: string;
}

const IMPORT_CLASS_REQUIRED_MESSAGE = 'يرجى اختيار الفصل أولاً';

/**
 * Validates that a target class was selected before CSV import begins.
 */
export function validateStudentImportClassSelected(importClassId: string): string | null {
  if (!importClassId?.trim()) {
    return IMPORT_CLASS_REQUIRED_MESSAGE;
  }
  return null;
}

/**
 * Resolves the display class name for imported student rows.
 */
export function resolveStudentImportClassName(
  classes: Pick<Class, 'id' | 'name'>[],
  importClassId: string
): string {
  return classes.find((c) => c.id === importClassId)?.name || '';
}

/**
 * Builds the Firestore student document for a parsed CSV row (matches Students import).
 */
export function buildStudentImportRecord(
  parsed: ParsedStudentRow,
  classId: string,
  className: string
): Omit<Student, 'id'> {
  return {
    fullName: parsed.name,
    classId,
    className,
    guardianName: parsed.guardianName,
    guardianPhone: parsed.guardianPhone,
    parentEmail: parsed.parentEmail,
    isActive: true,
  };
}

/**
 * Detects whether the first CSV row is a header and returns the data start index.
 */
export function detectStudentCsvStartIndex(firstCell?: string): number {
  if (!firstCell) return 0;
  return firstCell.includes('الاسم') || firstCell.includes('Name') ? 1 : 0;
}

/**
 * Parses a single student CSV row. Returns null for empty name rows.
 */
export function parseStudentCsvRow(row: string[]): ParsedStudentRow | null {
  const name = row[0]?.trim();
  if (!name) return null;

  return {
    name,
    guardianName: row[1]?.trim() || '',
    guardianPhone: row[2]?.trim() || '',
    parentEmail: row[3]?.trim() || '',
  };
}

/**
 * Counts rows that would be imported from a parsed CSV matrix (skips header + blank names).
 */
export function countImportableStudentRows(rows: string[][]): number {
  const startIndex = detectStudentCsvStartIndex(rows[0]?.[0]);
  let count = 0;
  for (let i = startIndex; i < rows.length; i++) {
    if (parseStudentCsvRow(rows[i])) count++;
  }
  return count;
}
