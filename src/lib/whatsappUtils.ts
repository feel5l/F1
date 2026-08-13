import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Strips non-digit characters from a phone number for WhatsApp wa.me links.
 */
export function cleanGuardianPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds the Arabic absence notification message sent to guardians.
 */
export function buildGuardianAbsenceMessage(studentName: string, date: Date): string {
  const formattedDate = format(date, 'PPP', { locale: ar });
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

/**
 * Builds a WhatsApp deep-link URL with pre-filled message text.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanGuardianPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
