/** Detect whether the first CSV row is a header and return the data start index. */
export function detectCsvStartIndex(firstCell: string | undefined): number {
  if (!firstCell) return 0;
  return firstCell.includes('الاسم') || firstCell.includes('Name') ? 1 : 0;
}
