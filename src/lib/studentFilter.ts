export interface FilterableStudent {
  fullName: string;
  classId: string;
}

/**
 * Filters students by name search and optional class filter.
 */
export function filterStudents<T extends FilterableStudent>(
  students: T[],
  search: string,
  classFilter: string
): T[] {
  const searchLower = search.toLowerCase();
  return students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchLower);
    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });
}
