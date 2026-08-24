/** Strip non-digit characters from a phone number for WhatsApp URLs. */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/** Build the Arabic attendance notification message for guardians. */
export function buildAttendanceWhatsAppMessage(
  studentName: string,
  formattedDate: string,
): string {
  return `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${studentName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
}

/** Build a WhatsApp click-to-chat URL. */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
