/** Strips non-digits for wa.me links (e.g. +966 5x xxx → 9665x). */
export function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
