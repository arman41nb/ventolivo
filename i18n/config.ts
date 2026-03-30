export const locales = ["en", "tr", "de", "fa", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  fa: "فارسی",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  de: "🇩🇪",
  fa: "🇮🇷",
  ar: "🇸🇦",
};

export const rtlLocales: Locale[] = ["fa", "ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
