export interface Class {
  id: string;
  name: string;
  gradeLevel: string;
  homeroomTeacher?: string;
  teacherEmail?: string;
}

export interface Student {
  id: string;
  fullName: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  parentEmail?: string;
  isActive: boolean;
}

export interface Session {
  id: string;
  date: any; // Firestore Timestamp
  period: number;
  subject: string;
  classId: string;
  teacherEmail: string;
}

export type AttendanceStatus = "حاضر" | "غائب" | "متأخر" | "بعذر";

export interface AttendanceLog {
  id: string;
  studentId: string;
  sessionId: string;
  status: AttendanceStatus;
  timestamp: any; // Firestore Timestamp
  note?: string;
}

export type AppRole = "ADMIN" | "TEACHER" | "TEACHER_LEADER" | "ATTENDANCE_OFFICER" | "SUPERVISOR";

export interface Permission {
  action: "read" | "write" | "delete" | "manage_staff" | "manage_students" | "view_reports";
  resource: "attendance" | "students" | "classes" | "staff" | "reports";
}

export interface StaffMember {
  id?: string;
  fullName: string;
  nationalId: string;
  jobNumber?: string;
  phone: string;
  role: string; // Keep for display/backwards compat
  appRole?: AppRole; // New structured role
  specialization: string;
  email: string;
}
