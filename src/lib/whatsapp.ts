export function sanitizeGuardianPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildWhatsAppNotificationUrl(phone: string, message: string): string {
  const cleanPhone = sanitizeGuardianPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
