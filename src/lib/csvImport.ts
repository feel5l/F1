/** Detect whether the first CSV row is a header (Arabic or English name column). */
export function getCsvImportStartIndex(firstCell: string | undefined): number {
  if (!firstCell) return 0;
  return firstCell.includes('الاسم') || firstCell.includes('Name') ? 1 : 0;
}
