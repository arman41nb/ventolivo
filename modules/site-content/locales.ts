import type { SiteLocaleConfig, SiteLocaleDirection } from "@/types";

export const SITE_LOCALE_CONTENT_KEY = "__siteLocales";
export const baseSiteLocaleCode = "en";
export const siteLocaleCodePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i;

const defaultLocalePresets: SiteLocaleConfig[] = [
  { code: "en", label: "English", direction: "ltr" },
  { code: "tr", label: "Turkish", direction: "ltr" },
  { code: "de", label: "German", direction: "ltr" },
  { code: "fa", label: "Farsi", direction: "rtl" },
  { code: "ar", label: "Arabic", direction: "rtl" },
];

const localeLabelByCode = new Map(
  defaultLocalePresets.map((locale) => [locale.code, locale.label]),
);

const localeDirectionByCode = new Map(
  defaultLocalePresets.map((locale) => [locale.code, locale.direction]),
);

export function normalizeSiteLocaleCode(code: string): string {
  return code.trim().toLowerCase();
}

export function isValidSiteLocaleCode(code: string): boolean {
  return siteLocaleCodePattern.test(normalizeSiteLocaleCode(code));
}

export function inferSiteLocaleLabel(code: string): string {
  const normalizedCode = normalizeSiteLocaleCode(code);
  const presetLabel = localeLabelByCode.get(normalizedCode);

  if (presetLabel) {
    return presetLabel;
  }

  return normalizedCode
    .split("-")
    .map((segment) => segment.toUpperCase())
    .join(" / ");
}

export function inferSiteLocaleDirection(
  code: string,
): SiteLocaleDirection {
  const normalizedCode = normalizeSiteLocaleCode(code);
  const presetDirection = localeDirectionByCode.get(normalizedCode);

  if (presetDirection) {
    return presetDirection;
  }

  return normalizedCode.startsWith("ar") ||
    normalizedCode.startsWith("fa") ||
    normalizedCode.startsWith("ur")
    ? "rtl"
    : "ltr";
}

export function getDefaultSiteLocales(): SiteLocaleConfig[] {
  return defaultLocalePresets.map((locale) => ({ ...locale }));
}

export function normalizeSiteLocales(
  locales: SiteLocaleConfig[] | undefined,
): SiteLocaleConfig[] {
  const normalizedEntries: SiteLocaleConfig[] = (locales ?? [])
    .map((locale) => ({
      code: normalizeSiteLocaleCode(locale.code),
      label: locale.label.trim(),
      direction:
        locale.direction === "rtl"
          ? ("rtl" as SiteLocaleDirection)
          : ("ltr" as SiteLocaleDirection),
    }))
    .filter(
      (locale) =>
        locale.code.length > 0 &&
        locale.label.length > 0 &&
        isValidSiteLocaleCode(locale.code),
    );

  const uniqueByCode = new Map<string, SiteLocaleConfig>();

  for (const locale of normalizedEntries) {
    if (!uniqueByCode.has(locale.code)) {
      uniqueByCode.set(locale.code, locale);
    }
  }

  if (!uniqueByCode.has(baseSiteLocaleCode)) {
    uniqueByCode.set(baseSiteLocaleCode, {
      code: baseSiteLocaleCode,
      label: inferSiteLocaleLabel(baseSiteLocaleCode),
      direction: inferSiteLocaleDirection(baseSiteLocaleCode),
    });
  }

  return Array.from(uniqueByCode.values()).sort((left, right) => {
    if (left.code === baseSiteLocaleCode) {
      return -1;
    }

    if (right.code === baseSiteLocaleCode) {
      return 1;
    }

    return left.label.localeCompare(right.label);
  });
}
