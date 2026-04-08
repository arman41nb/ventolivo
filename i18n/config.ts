import {
  baseSiteLocaleCode,
  getDefaultSiteLocales,
  getSiteLocaleFlag,
} from "@/modules/site-content/locales";

const defaultSiteLocales = getDefaultSiteLocales();
const defaultSiteLocaleCodes = defaultSiteLocales.map((locale) => locale.code);

export const locales = [...defaultSiteLocaleCodes];
export type Locale = string;

export const defaultLocale: Locale = baseSiteLocaleCode;
export const localePreferenceCookieName = "NEXT_LOCALE";

export const localeLabels: Record<string, string> = Object.fromEntries(
  defaultSiteLocales.map((locale) => [locale.code, locale.label]),
);

export const localeFlags: Record<string, string> = Object.fromEntries(
  defaultSiteLocales.map((locale) => [locale.code, getSiteLocaleFlag(locale.code)]),
);

export const rtlLocales: Locale[] = Array.from(
  new Set(
    defaultSiteLocales
      .filter((locale) => locale.direction === "rtl")
      .map((locale) => locale.code)
      .concat(["ur"]),
  ),
);

const localeCodePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i;

export function normalizeLocale(locale: string): Locale {
  return locale.trim().toLowerCase();
}

export function isRtl(locale: Locale): boolean {
  const normalizedLocale = normalizeLocale(locale);
  return rtlLocales.includes(normalizedLocale) || normalizedLocale.startsWith("ar");
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function isValidLocale(locale: string): locale is Locale {
  return localeCodePattern.test(normalizeLocale(locale));
}

export function getLocaleCandidates(locale: string): Locale[] {
  if (!isValidLocale(locale)) {
    return [];
  }

  const normalizedLocale = normalizeLocale(locale);
  const [baseLocale] = normalizedLocale.split("-");

  return Array.from(
    new Set(
      [normalizedLocale, baseLocale, defaultLocale].filter(Boolean) as Locale[],
    ),
  );
}
