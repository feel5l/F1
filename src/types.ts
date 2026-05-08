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

export interface StaffMember {
  id?: string;
  fullName: string;
  nationalId: string;
  jobNumber?: string;
  phone: string;
  role: string;
  specialization: string;
  email: string;
}
