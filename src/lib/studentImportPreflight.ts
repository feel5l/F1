export type StudentImportPreflightFailure = 'missing-class' | 'missing-file';

export interface StudentImportPreflightOk {
  ok: true;
}

export interface StudentImportPreflightError {
  ok: false;
  reason: StudentImportPreflightFailure;
}

export type StudentImportPreflightResult = StudentImportPreflightOk | StudentImportPreflightError;

/** Guards CSV import before parsing (Students page). */
export function validateStudentImportPreflight(
  importClassId: string,
  file: File | undefined | null
): StudentImportPreflightResult {
  if (!importClassId.trim()) {
    return { ok: false, reason: 'missing-class' };
  }
  if (!file) {
    return { ok: false, reason: 'missing-file' };
  }
  return { ok: true };
}