import type { StaffMember } from '../types';

export function filterStaffMembers(
  staff: ReadonlyArray<StaffMember>,
  searchTerm: string
): StaffMember[] {
  const q = searchTerm.trim().toLowerCase();
  if (!q) return [...staff];

  return staff.filter((member) => {
    if (member.fullName.toLowerCase().includes(q)) return true;
    if ((member.role || '').toLowerCase().includes(q)) return true;
    const nationalId = member.nationalId ?? '';
    return nationalId.includes(searchTerm.trim());
  });
}
