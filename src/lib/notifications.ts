export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildAbsenceNotificationMessage(
  studentName: string,
  formattedDate: string,
): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/** Whether a guardian can receive a WhatsApp absence notification. */
export function canNotifyGuardian(
  student?: { guardianPhone?: string } | null,
): student is { guardianPhone: string } {
  return Boolean(student?.guardianPhone?.trim());
}
