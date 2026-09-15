/**
 * Strips non-digit characters from a phone number for WhatsApp deep links.
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds the Arabic absence notification message sent to guardians.
 */
export function buildAbsenceNotificationMessage(
  studentName: string,
  formattedDate: string
): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

/**
 * Builds a WhatsApp deep-link URL for guardian notification.
 */
export function buildGuardianWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
