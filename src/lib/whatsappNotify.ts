/** Strip non-digits from guardian phone numbers for wa.me links. */
export function sanitizeGuardianPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/** Guardian notification body (matches Logs page copy). */
export function buildGuardianAttendanceMessage(
  studentFullName: string,
  formattedDate: string
): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentFullName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

export function buildGuardianWhatsAppUrl(cleanPhone: string, message: string): string {
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
