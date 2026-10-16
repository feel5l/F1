import { StaffMember } from '../types';

/**
 * Filters staff list by search term (name, job title, national ID).
 * Safe when legacy records omit nationalId.
 */
export function filterStaffMembers(
  staff: StaffMember[],
  searchTerm: string
): StaffMember[] {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return staff;

  return staff.filter((member) => {
    const nameMatch = member.fullName.toLowerCase().includes(term);
    const roleMatch = (member.role || '').toLowerCase().includes(term);
    const nationalIdMatch = (member.nationalId ?? '').includes(searchTerm.trim());
    return nameMatch || roleMatch || nationalIdMatch;
  });
}
