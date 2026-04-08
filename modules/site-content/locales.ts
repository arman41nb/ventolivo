import type { SiteLocaleConfig, SiteLocaleDirection } from "@/types";

export const SITE_LOCALE_CONTENT_KEY = "__siteLocales";
export const baseSiteLocaleCode = "en";
export const siteLocaleCodePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i;

export interface SiteLocalePreset extends SiteLocaleConfig {
  nativeLabel: string;
  flag: string;
  aliases?: string[];
}

const localeCatalog: SiteLocalePreset[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    direction: "ltr",
    flag: "🇺🇸",
    aliases: ["american english", "uk english"],
  },
  {
    code: "tr",
    label: "Turkish",
    nativeLabel: "Turkce",
    direction: "ltr",
    flag: "🇹🇷",
    aliases: ["turkiye"],
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    direction: "ltr",
    flag: "🇩🇪",
  },
  {
    code: "fa",
    label: "Farsi",
    nativeLabel: "فارسی",
    direction: "rtl",
    flag: "🇮🇷",
    aliases: ["persian"],
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    direction: "rtl",
    flag: "🇸🇦",
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Espanol",
    direction: "ltr",
    flag: "🇪🇸",
    aliases: ["castellano"],
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Francais",
    direction: "ltr",
    flag: "🇫🇷",
  },
  {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    direction: "ltr",
    flag: "🇮🇹",
  },
  {
    code: "pt",
    label: "Portuguese",
    nativeLabel: "Portugues",
    direction: "ltr",
    flag: "🇵🇹",
  },
  {
    code: "pt-br",
    label: "Portuguese (Brazil)",
    nativeLabel: "Portugues (Brasil)",
    direction: "ltr",
    flag: "🇧🇷",
    aliases: ["brazilian portuguese"],
  },
  {
    code: "ru",
    label: "Russian",
    nativeLabel: "Русский",
    direction: "ltr",
    flag: "🇷🇺",
  },
  {
    code: "nl",
    label: "Dutch",
    nativeLabel: "Nederlands",
    direction: "ltr",
    flag: "🇳🇱",
  },
  {
    code: "el",
    label: "Greek",
    nativeLabel: "Ελληνικα",
    direction: "ltr",
    flag: "🇬🇷",
  },
  {
    code: "az",
    label: "Azerbaijani",
    nativeLabel: "Azarbaycan dili",
    direction: "ltr",
    flag: "🇦🇿",
  },
  {
    code: "ur",
    label: "Urdu",
    nativeLabel: "اردو",
    direction: "rtl",
    flag: "🇵🇰",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "zh",
    label: "Chinese",
    nativeLabel: "中文",
    direction: "ltr",
    flag: "🇨🇳",
    aliases: ["mandarin"],
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    direction: "ltr",
    flag: "🇯🇵",
  },
  {
    code: "ko",
    label: "Korean",
    nativeLabel: "한국어",
    direction: "ltr",
    flag: "🇰🇷",
  },
];

const defaultLocalePresets: SiteLocaleConfig[] = localeCatalog
  .filter((locale) => ["en", "tr", "de", "fa", "ar"].includes(locale.code))
  .map(({ code, label, direction }) => ({
    code,
    label,
    direction,
  }));

const localePresetByCode = new Map(localeCatalog.map((locale) => [locale.code, locale]));

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
  const presetLabel =
    getSiteLocalePreset(normalizedCode)?.label || localeLabelByCode.get(normalizedCode);

  if (presetLabel) {
    return presetLabel;
  }

  return normalizedCode
    .split("-")
    .map((segment) => segment.toUpperCase())
    .join(" / ");
}

export function inferSiteLocaleDirection(code: string): SiteLocaleDirection {
  const normalizedCode = normalizeSiteLocaleCode(code);
  const presetDirection =
    getSiteLocalePreset(normalizedCode)?.direction || localeDirectionByCode.get(normalizedCode);

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

export function getSiteLocaleCatalog(): SiteLocalePreset[] {
  return localeCatalog.map((locale) => ({ ...locale }));
}

export function getSiteLocalePreset(code: string): SiteLocalePreset | undefined {
  return localePresetByCode.get(normalizeSiteLocaleCode(code));
}

export function getSiteLocaleFlag(code: string): string {
  return getSiteLocalePreset(code)?.flag ?? normalizeSiteLocaleCode(code).slice(0, 2).toUpperCase();
}

export function getSiteLocaleNativeLabel(code: string): string {
  return getSiteLocalePreset(code)?.nativeLabel ?? inferSiteLocaleLabel(code);
}

export function normalizeSiteLocales(locales: SiteLocaleConfig[] | undefined): SiteLocaleConfig[] {
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
        locale.code.length > 0 && locale.label.length > 0 && isValidSiteLocaleCode(locale.code),
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
