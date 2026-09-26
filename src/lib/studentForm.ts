import { Student } from '../types';

export interface StudentFormInput {
  fullName: string;
  classId: string;
}

/**
 * Validates required fields before saving a student record.
 */
export function validateStudentForm(form: StudentFormInput): boolean {
  return Boolean(form.fullName?.trim() && form.classId?.trim());
}

/**
 * Filters students by search term and optional class id.
 */
export function filterStudents(
  students: Student[],
  search: string,
  classFilter: string
): Student[] {
  const normalizedSearch = search.toLowerCase();
  return students.filter((student) => {
    const matchesSearch = student.fullName.toLowerCase().includes(normalizedSearch);
    const matchesClass = classFilter === 'all' || student.classId === classFilter;
    return matchesSearch && matchesClass;
  });
}
