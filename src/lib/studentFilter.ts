import { Student } from '../types';

/**
 * Filters students by name search and optional class ID.
 */
export function filterStudentsBySearchAndClass(
  students: Student[],
  search: string,
  classFilter: string
): Student[] {
  const term = search.toLowerCase();
  return students.filter((student) => {
    const matchesSearch = student.fullName.toLowerCase().includes(term);
    const matchesClass = classFilter === 'all' || student.classId === classFilter;
    return matchesSearch && matchesClass;
  });
}
