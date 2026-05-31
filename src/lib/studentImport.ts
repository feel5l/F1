export interface StudentCsvImportRow {
  fullName: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail: string;
}

/**
 * Detects whether the first CSV row is a header (Arabic or English).
 */
export function getCsvImportStartIndex(firstCell?: string): number {
  const cell = firstCell ?? '';
  if (cell.includes('الاسم') || cell.includes('Name')) return 1;
  return 0;
}

/**
 * Maps a CSV data row to import fields; returns null when the name column is empty.
 */
export function parseStudentCsvRow(row: string[]): StudentCsvImportRow | null {
  const name = row[0]?.trim();
  if (!name) return null;
  return {
    fullName: name,
    guardianName: row[1]?.trim() || '',
    guardianPhone: row[2]?.trim() || '',
    parentEmail: row[3]?.trim() || '',
  };
}

export function parseStudentCsvRows(
  data: string[][],
  startIndex: number
): StudentCsvImportRow[] {
  const rows: StudentCsvImportRow[] = [];
  for (let i = startIndex; i < data.length; i++) {
    const parsed = parseStudentCsvRow(data[i]);
    if (parsed) rows.push(parsed);
  }
  return rows;
}
