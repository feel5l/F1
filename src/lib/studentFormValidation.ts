/** Ensures required student fields are present before Firestore write. */
export function isStudentFormComplete(fullName: string, classId: string): boolean {
  return Boolean(fullName.trim() && classId.trim());
}