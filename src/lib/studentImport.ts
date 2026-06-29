export interface ParsedStudentRow {
  name: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail: string;
}

/** Detect whether the first CSV row is a header and return the data start index. */
export function detectStudentCsvStartIndex(firstCell?: string): number {
  if (!firstCell) return 0;
  return firstCell.includes('الاسم') || firstCell.includes('Name') ? 1 : 0;
}

/** Parse a single student CSV row. Returns null for empty name rows. */
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
