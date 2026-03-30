import type { Locale } from "@/i18n/config";

export function localePath(locale: Locale, path: string): string {
  if (path.startsWith("/#")) {
    return `/${locale}${path.slice(1)}`;
  }
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
