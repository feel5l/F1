/** Sort class names for Arabic locale (Classes page). */
export function sortClassesByArabicName<T extends { name: string }>(classes: readonly T[]): T[] {
  return [...classes].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}

/** Maps Select sentinel "none" to empty teacher email when saving a class. */
export function coerceTeacherEmailSelect(value: string): string {
  return value === 'none' ? '' : value;
}