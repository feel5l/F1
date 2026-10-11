import { Class, Student } from '../types';

export interface StudentFormInput {
  fullName: string;
  classId: string;
}

export interface StudentSaveInput {
  fullName: string;
  classId: string;
  className?: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail?: string;
  isActive: boolean;
}

/**
 * Resolves className from the live classes list before persisting a student record.
 */
export function buildStudentSavePayload(
  form: StudentSaveInput,
  classes: Pick<Class, 'id' | 'name'>[]
): Omit<Student, 'id'> {
  const selectedClass = classes.find((c) => c.id === form.classId);
  return {
    ...form,
    className: selectedClass?.name || form.className || '',
    parentEmail: form.parentEmail || '',
  };
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
