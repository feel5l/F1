import type { StaffMember } from '../types';

/** Filters staff by name, job title, or national ID; tolerates missing nationalId on legacy rows. */
export function filterStaffMembers(
  staff: StaffMember[],
  searchTerm: string
): StaffMember[] {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return staff;

  const idNeedle = searchTerm.trim();
  return staff.filter((member) => {
    const nameMatch = member.fullName.toLowerCase().includes(term);
    const roleMatch = (member.role || '').toLowerCase().includes(term);
    const nationalIdMatch = (member.nationalId ?? '').includes(idNeedle);
    return nameMatch || roleMatch || nationalIdMatch;
  });
}
