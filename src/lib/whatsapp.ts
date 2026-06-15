export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${cleanPhoneNumber(phone)}?text=${encodeURIComponent(message)}`;
}
