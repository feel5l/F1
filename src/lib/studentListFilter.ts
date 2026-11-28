import type { Student } from '../types';

export function matchesStudentFilters(
  student: Student,
  search: string,
  classFilter: string
): boolean {
  const matchesSearch = student.fullName.toLowerCase().includes(search.toLowerCase());
  const matchesClass = classFilter === 'all' || student.classId === classFilter;
  return matchesSearch && matchesClass;
}

export function filterStudents(
  students: Student[],
  search: string,
  classFilter: string
): Student[] {
  return students.filter((s) => matchesStudentFilters(s, search, classFilter));
}