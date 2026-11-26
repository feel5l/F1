import type { StaffMember } from '../types';

export function matchesStaffSearch(member: StaffMember, search: string): boolean {
  const term = search.toLowerCase();
  return (
    member.fullName.toLowerCase().includes(term) ||
    (member.role || '').toLowerCase().includes(term) ||
    member.nationalId.includes(search)
  );
}

export function filterStaffList(staff: StaffMember[], search: string): StaffMember[] {
  return staff.filter((m) => matchesStaffSearch(m, search));
}