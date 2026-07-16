import { Student } from '../types';

/**
 * Filters students by name search and optional class.
 */
export function filterStudents(
  students: Student[],
  search: string,
  classFilter: string,
): Student[] {
  const normalizedSearch = search.toLowerCase();

  return students.filter((student) => {
    const matchesSearch = student.fullName
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesClass =
      classFilter === 'all' || student.classId === classFilter;
    return matchesSearch && matchesClass;
  });
}
