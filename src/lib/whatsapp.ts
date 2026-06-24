/**
 * Strips non-digit characters from guardian phone numbers for wa.me links.
 */
export function cleanGuardianPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildAbsenceWhatsAppMessage(
  studentName: string,
  formattedDate: string
): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanGuardianPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function hasGuardianPhone(phone?: string): boolean {
  return Boolean(phone?.trim());
}
