/**
 * Strips non-digit characters from a phone number for WhatsApp wa.me links.
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export interface AbsenceNotificationParams {
  studentName: string;
  formattedDate: string;
  guardianPhone: string;
}

/**
 * Builds a WhatsApp deep-link URL for guardian absence notifications.
 */
export function buildWhatsAppAbsenceUrl({
  studentName,
  formattedDate,
  guardianPhone,
}: AbsenceNotificationParams): string {
  const message = `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
  const cleanPhone = cleanPhoneNumber(guardianPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
