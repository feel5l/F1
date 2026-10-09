export interface ParsedStudentImportRow {
  fullName: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail: string;
}

/** Detects whether the first CSV row is a header (Arabic or English name column). */
export function csvImportStartIndex(firstCell: string | undefined): number {
  const cell = firstCell ?? '';
  return cell.includes('الاسم') || cell.includes('Name') ? 1 : 0;
}

export function parseStudentImportRow(row: string[]): ParsedStudentImportRow | null {
  const fullName = row[0]?.trim();
  if (!fullName) return null;
  return {
    fullName,
    guardianName: row[1]?.trim() ?? '',
    guardianPhone: row[2]?.trim() ?? '',
    parentEmail: row[3]?.trim() ?? '',
  };
}
