/**
 * Maps teacher select value from the UI to the stored teacherEmail field.
 */
export function normalizeTeacherEmailSelection(value: string): string {
  return value === 'none' ? '' : value;
}
