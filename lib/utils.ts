import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config";
import type { Product, ProductMediaItem } from "@/types";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

export function formatPrice(price: number): string {
  return `${siteConfig.currency}${price}`;
}

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  const number = siteConfig.whatsapp.number;
  if (number) {
    return `${siteConfig.whatsapp.baseUrl}/${number}?text=${encoded}`;
  }
  return `${siteConfig.whatsapp.baseUrl}/?text=${encoded}`;
}

export function buildProductWhatsAppMessage(
  productName: string,
  price: number
): string {
  return `Hello! I'd like to order: ${productName} (${formatPrice(price)})`;
}

export function getPrimaryProductMedia(product: Product): ProductMediaItem | undefined {
  return (
    product.media?.find((item) => item.role === "cover") ??
    product.media?.find((item) => item.type === "image") ??
    product.media?.[0]
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
