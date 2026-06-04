/** Detect Arabic/English header row in student CSV imports. */
export function getCsvDataStartIndex(firstCell?: string): number {
  if (!firstCell) return 0;
  return firstCell.includes('الاسم') || firstCell.includes('Name') ? 1 : 0;
}

export interface ParsedStudentRow {
  fullName: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail: string;
}

export function parseStudentCsvRow(row: string[]): ParsedStudentRow | null {
  const fullName = row[0]?.trim();
  if (!fullName) return null;
  return {
    fullName,
    guardianName: row[1]?.trim() || '',
    guardianPhone: row[2]?.trim() || '',
    parentEmail: row[3]?.trim() || '',
  };
}
