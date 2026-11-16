export type StudentImportPreflightError = 'missing_class' | 'missing_file';

export type StudentImportPreflightResult =
  | { ok: true }
  | { ok: false; error: StudentImportPreflightError };

/** Validates required inputs before parsing a student CSV (Students import dialog). */
export function validateStudentImportPreflight(
  importClassId: string,
  file: File | null | undefined
): StudentImportPreflightResult {
  if (!importClassId.trim()) {
    return { ok: false, error: 'missing_class' };
  }
  if (!file) {
    return { ok: false, error: 'missing_file' };
  }
  return { ok: true };
}