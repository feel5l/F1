/** Student list filtering for the Students page (search + class). */
export function filterStudentsForDirectory<T extends { fullName: string; classId: string }>(
  students: readonly T[],
  search: string,
  classFilter: string
): T[] {
  const query = search.toLowerCase();
  return students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(query);
    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });
}
