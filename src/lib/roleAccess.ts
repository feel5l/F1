import type { AppRole, StaffMember } from '../types';

/** Email allowed to self-bootstrap ADMIN in roles collection on first sign-in. */
export const BOOTSTRAP_ADMIN_EMAIL = 'alzaem3000@gmail.com';

export function shouldBootstrapAdminRole(
  email: string,
  roleData: { role?: AppRole } | null | undefined
): boolean {
  return !roleData?.role && email === BOOTSTRAP_ADMIN_EMAIL;
}

export function getRoleFlags(appRole?: AppRole) {
  return {
    isAdmin: appRole === 'ADMIN',
    isTeacher: appRole === 'TEACHER' || appRole === 'TEACHER_LEADER',
    isSupervisor: appRole === 'SUPERVISOR',
  };
}

/** Mirrors class list filtering in Attendance — broad roles see all classes. */
export function canViewAllClasses(isAdmin: boolean, appRole?: AppRole): boolean {
  return (
    isAdmin ||
    appRole === 'ATTENDANCE_OFFICER' ||
    appRole === 'TEACHER_LEADER' ||
    appRole === 'SUPERVISOR'
  );
}

export function resolveStaffMemberForSession(params: {
  staffFromQuery: StaffMember | null;
  roleData: { role?: AppRole } | null | undefined;
  authEmail: string;
  displayName?: string | null;
}): StaffMember | null {
  const { staffFromQuery, roleData, authEmail, displayName } = params;

  if (staffFromQuery) {
    const data = { ...staffFromQuery };
    if (roleData?.role) {
      data.appRole = roleData.role;
    }
    return data;
  }

  if (roleData?.role) {
    return {
      fullName: displayName || 'مستخدم جديد',
      email: authEmail,
      phone: '',
      role: 'موظف',
      appRole: roleData.role,
      specialization: '',
      nationalId: '',
    };
  }

  return null;
}
