export interface StudentFormInput {
  fullName: string;
  classId: string;
}

/** Required fields before persisting a student record (Students page). */
export function validateStudentForm(input: StudentFormInput): boolean {
  return Boolean(input.fullName.trim() && input.classId.trim());
}