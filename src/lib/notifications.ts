const SCHOOL_NAME = 'مدرسة زيد بن ثابت';

/**
 * Strips non-digit characters from a phone number for WhatsApp wa.me links.
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds the Arabic absence notification message sent to guardians.
 */
export function buildAbsenceMessage(studentName: string, formattedDate: string): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن ${SCHOOL_NAME} اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

/**
 * Builds a WhatsApp deep link for guardian absence notifications.
 */
export function buildAbsenceWhatsAppUrl(
  studentName: string,
  guardianPhone: string,
  formattedDate: string
): string {
  const cleanPhone = cleanPhoneNumber(guardianPhone);
  const message = buildAbsenceMessage(studentName, formattedDate);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
