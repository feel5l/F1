import { AttendanceStatus } from '../types';

export function calculateReportsAttendanceRate(
  present: number,
  late: number,
  excused: number,
  total: number
): number {
  if (total <= 0) return 0;
  return Math.round(((present + late + excused) / total) * 100);
}

export function calculateDashboardAttendanceRate(
  present: number,
  late: number,
  totalStudents: number
): number {
  if (totalStudents <= 0) return 0;
  return Math.round(((present + late) / totalStudents) * 100);
}

export function detectCsvHeaderStartIndex(firstCell?: string): 0 | 1 {
  if (firstCell?.includes('الاسم') || firstCell?.includes('Name')) {
    return 1;
  }
  return 0;
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function countAttendanceByStatus(
  statuses: AttendanceStatus[]
): { present: number; absent: number; late: number; excused: number; total: number } {
  const present = statuses.filter((s) => s === 'حاضر').length;
  const absent = statuses.filter((s) => s === 'غائب').length;
  const late = statuses.filter((s) => s === 'متأخر').length;
  const excused = statuses.filter((s) => s === 'بعذر').length;
  return { present, absent, late, excused, total: statuses.length };
}
