import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AttendanceLog, Student } from '../types';

/**
 * Strips non-digit characters from a phone number for wa.me links.
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds the Arabic absence notification message sent to guardians.
 */
export function buildAbsenceNotificationMessage(
  studentName: string,
  date: Date
): string {
  const formattedDate = format(date, 'PPP', { locale: ar });
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

/**
 * Builds a WhatsApp deep-link URL for guardian absence notification.
 * Returns null when the student has no guardian phone.
 */
export function buildWhatsAppNotificationUrl(
  log: Pick<AttendanceLog, 'timestamp'>,
  student: Pick<Student, 'fullName' | 'guardianPhone'> | undefined,
  toDate: (timestamp: AttendanceLog['timestamp']) => Date
): string | null {
  if (!student?.guardianPhone) return null;

  const date = toDate(log.timestamp);
  const message = buildAbsenceNotificationMessage(student.fullName, date);
  const cleanPhone = cleanPhoneNumber(student.guardianPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
