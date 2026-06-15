export interface StaffSearchable {
  fullName: string;
  role?: string;
  nationalId: string;
}

export function filterStaff<T extends StaffSearchable>(
  staff: T[],
  searchTerm: string
): T[] {
  const term = searchTerm.toLowerCase();
  return staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(term) ||
      (member.role || '').toLowerCase().includes(term) ||
      member.nationalId.includes(searchTerm)
  );
}
