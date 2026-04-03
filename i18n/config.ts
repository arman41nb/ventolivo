export const locales = ["en", "tr", "de", "fa", "ar"] as const;
export type Locale = string;

export const defaultLocale: Locale = "en";

export const localeLabels: Record<string, string> = {
  en: "English",
  tr: "Turkce",
  de: "Deutsch",
  fa: "Farsi",
  ar: "Arabic",
};

export const localeFlags: Record<string, string> = {
  en: "EN",
  tr: "TR",
  de: "DE",
  fa: "FA",
  ar: "AR",
};

export const rtlLocales: Locale[] = ["fa", "ar", "ur"];
const localeCodePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i;

export function isRtl(locale: Locale): boolean {
  const normalizedLocale = locale.toLowerCase();
  return rtlLocales.includes(normalizedLocale) || normalizedLocale.startsWith("ar");
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function isValidLocale(locale: string): locale is Locale {
  return localeCodePattern.test(locale.trim());
}
