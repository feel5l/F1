/** Digits-only phone for wa.me links (matches Logs guardian notification flow). */
export function sanitizeGuardianPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function hasGuardianPhone(phone: string | undefined | null): boolean {
  return sanitizeGuardianPhone(phone ?? '').length > 0;
}

export function buildAbsenceWhatsAppMessage(studentName: string, formattedDate: string): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

export function buildGuardianWhatsAppUrl(cleanPhone: string, message: string): string {
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}