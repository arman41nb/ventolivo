import { CURRENCY } from "./constants";

export function formatPrice(price: number): string {
  return `${CURRENCY}${price}`;
}

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}

export function buildProductWhatsAppMessage(
  productName: string,
  price: number
): string {
  return `Hello! I'd like to order: ${productName} (${formatPrice(price)})`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
