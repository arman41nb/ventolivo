import { prisma } from "./client";
import {
  defaultSiteContentSettings,
  defaultSiteLocales,
} from "@/modules/site-content/defaults";
import {
  SITE_LOCALE_CONTENT_KEY,
  normalizeSiteLocales,
} from "@/modules/site-content/locales";
import type {
  SiteContentInput,
  SiteContentLocaleInput,
  SiteLocaleConfig,
  SiteContentSettings,
} from "@/types";

const sharedJsonKeys = [
  "aboutImageUrl",
  "aboutImageAlt",
  "heroAccentImageUrl",
  "heroAccentImageAlt",
  "heroAccentImageOffsetX",
  "heroAccentImageOffsetY",
  "heroAccentImageScale",
  "heroForegroundMedia",
  "heroImageOffsetX",
  "heroImageOffsetY",
  "heroImageScale",
] as const;

const localizedJsonKeys = [
  "navbarLinkProducts",
  "navbarLinkAbout",
  "navbarLinkContact",
  "heroPrimaryButtonLabel",
  "heroSecondaryButtonLabel",
  "stripBannerItem1",
  "stripBannerItem2",
  "stripBannerItem3",
  "stripBannerItem4",
  "featuredProductsTitle",
  "featuredProductsViewAllLabel",
  "aboutSubtitle",
  "aboutTitleLine1",
  "aboutTitleLine2",
  "aboutDescription",
  "aboutButtonLabel",
  "feature1Title",
  "feature1Text",
  "feature2Title",
  "feature2Text",
  "feature3Title",
  "feature3Text",
] as const;

function parseRawContentJson(
  value: string | null | undefined,
): Record<string, unknown> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function parseContentJson(
  value: string | null | undefined,
): Partial<SiteContentSettings> {
  const rawContent = parseRawContentJson(value);

  return Object.fromEntries(
    Object.entries(rawContent).filter(([key]) => key !== SITE_LOCALE_CONTENT_KEY),
  ) as Partial<SiteContentSettings>;
}

function parseSiteLocales(
  value: string | null | undefined,
): SiteLocaleConfig[] {
  const rawContent = parseRawContentJson(value);
  const rawLocales = rawContent[SITE_LOCALE_CONTENT_KEY];

  if (!Array.isArray(rawLocales)) {
    return defaultSiteLocales;
  }

  return normalizeSiteLocales(
    rawLocales.map((locale) => ({
      code: typeof locale?.code === "string" ? locale.code : "",
      label: typeof locale?.label === "string" ? locale.label : "",
      direction: locale?.direction === "rtl" ? "rtl" : "ltr",
    })),
  );
}

function pickContentValues(
  input: Partial<SiteContentSettings>,
  keys: readonly (keyof SiteContentSettings)[],
) {
  return Object.fromEntries(
    keys.map((key) => [key, input[key] ?? defaultSiteContentSettings[key]]),
  );
}

function serializeContentValues(
  input: Partial<SiteContentSettings>,
  keys: readonly (keyof SiteContentSettings)[],
) {
  return JSON.stringify(pickContentValues(input, keys));
}

function serializeSiteContentConfig(
  input: Partial<SiteContentSettings>,
  siteLocales: SiteLocaleConfig[] | undefined,
) {
  return JSON.stringify({
    ...pickContentValues(input, sharedJsonKeys),
    [SITE_LOCALE_CONTENT_KEY]: normalizeSiteLocales(siteLocales),
  });
}

function getBaseColumnValues(input: Partial<SiteContentSettings>) {
  return {
    brandName: input.brandName ?? defaultSiteContentSettings.brandName,
    logoMode: input.logoMode ?? defaultSiteContentSettings.logoMode,
    logoText: input.logoText ?? defaultSiteContentSettings.logoText,
    logoImageUrl: input.logoImageUrl ?? defaultSiteContentSettings.logoImageUrl,
    logoAltText: input.logoAltText ?? defaultSiteContentSettings.logoAltText,
    navbarCtaLabel:
      input.navbarCtaLabel ?? defaultSiteContentSettings.navbarCtaLabel,
    heroSubtitle: input.heroSubtitle ?? defaultSiteContentSettings.heroSubtitle,
    heroTitleLine1:
      input.heroTitleLine1 ?? defaultSiteContentSettings.heroTitleLine1,
    heroTitleLine2:
      input.heroTitleLine2 ?? defaultSiteContentSettings.heroTitleLine2,
    heroTitleLine3:
      input.heroTitleLine3 ?? defaultSiteContentSettings.heroTitleLine3,
    heroDescription:
      input.heroDescription ?? defaultSiteContentSettings.heroDescription,
    heroBadgeValue:
      input.heroBadgeValue ?? defaultSiteContentSettings.heroBadgeValue,
    heroBadgeLabel:
      input.heroBadgeLabel ?? defaultSiteContentSettings.heroBadgeLabel,
    heroImageUrl: input.heroImageUrl ?? defaultSiteContentSettings.heroImageUrl,
    heroImageAlt: input.heroImageAlt ?? defaultSiteContentSettings.heroImageAlt,
    ctaTitleLine1:
      input.ctaTitleLine1 ?? defaultSiteContentSettings.ctaTitleLine1,
    ctaTitleLine2:
      input.ctaTitleLine2 ?? defaultSiteContentSettings.ctaTitleLine2,
    ctaDescription:
      input.ctaDescription ?? defaultSiteContentSettings.ctaDescription,
    ctaButtonLabel:
      input.ctaButtonLabel ?? defaultSiteContentSettings.ctaButtonLabel,
    footerCopyrightText:
      input.footerCopyrightText ??
      defaultSiteContentSettings.footerCopyrightText,
  };
}

function mapSiteContentRecord(
  record:
    | {
        brandName: string;
        logoMode: string;
        logoText: string;
        logoImageUrl: string | null;
        logoAltText: string | null;
        contentJson: string | null;
        navbarCtaLabel: string;
        heroSubtitle: string;
        heroTitleLine1: string;
        heroTitleLine2: string;
        heroTitleLine3: string;
        heroDescription: string;
        heroBadgeValue: string;
        heroBadgeLabel: string;
        heroImageUrl: string | null;
        heroImageAlt: string | null;
        ctaTitleLine1: string;
        ctaTitleLine2: string;
        ctaDescription: string;
        ctaButtonLabel: string;
        footerCopyrightText: string;
      }
    | null
    | undefined,
): SiteContentSettings {
  const sharedContent = parseContentJson(record?.contentJson);

  return {
    ...defaultSiteContentSettings,
    ...sharedContent,
    ...(record
      ? {
          brandName: record.brandName,
          logoMode: record.logoMode === "image" ? "image" : "text",
          logoText: record.logoText,
          logoImageUrl: record.logoImageUrl ?? undefined,
          logoAltText: record.logoAltText ?? undefined,
          navbarCtaLabel: record.navbarCtaLabel,
          heroSubtitle: record.heroSubtitle,
          heroTitleLine1: record.heroTitleLine1,
          heroTitleLine2: record.heroTitleLine2,
          heroTitleLine3: record.heroTitleLine3,
          heroDescription: record.heroDescription,
          heroBadgeValue: record.heroBadgeValue,
          heroBadgeLabel: record.heroBadgeLabel,
          heroImageUrl: record.heroImageUrl ?? undefined,
          heroImageAlt: record.heroImageAlt ?? undefined,
          ctaTitleLine1: record.ctaTitleLine1,
          ctaTitleLine2: record.ctaTitleLine2,
          ctaDescription: record.ctaDescription,
          ctaButtonLabel: record.ctaButtonLabel,
          footerCopyrightText: record.footerCopyrightText,
        }
      : {}),
  };
}

export async function dbGetSiteContentSettings(): Promise<SiteContentSettings> {
  const settings = await prisma.siteContentSettings.findUnique({
    where: { id: 1 },
    include: {
      translations: true,
    },
  });

  return mapSiteContentRecord(settings);
}

export async function dbGetSiteLocales(): Promise<SiteLocaleConfig[]> {
  const settings = await prisma.siteContentSettings.findUnique({
    where: { id: 1 },
    select: {
      contentJson: true,
    },
  });

  return parseSiteLocales(settings?.contentJson);
}

export async function dbUpsertSiteContentSettings(
  input: SiteContentInput,
): Promise<SiteContentSettings> {
  const settings = await prisma.siteContentSettings.upsert({
    where: { id: 1 },
    update: {
      ...getBaseColumnValues(input),
      contentJson: serializeSiteContentConfig(input, input.siteLocales),
    },
    create: {
      id: 1,
      ...getBaseColumnValues(input),
      contentJson: serializeSiteContentConfig(input, input.siteLocales),
    },
  });

  return mapSiteContentRecord(settings);
}

export async function dbGetLocalizedSiteContentSettings(
  locale: string,
): Promise<SiteContentSettings> {
  const settings = await prisma.siteContentSettings.findUnique({
    where: { id: 1 },
    include: {
      translations: {
        where: { locale },
        take: 1,
      },
    },
  });

  const base = mapSiteContentRecord(settings);
  const translation = settings?.translations[0];
  const localizedContent = parseContentJson(translation?.contentJson);

  if (!translation) {
    return base;
  }

  return {
    ...base,
    ...pickContentValues(localizedContent, localizedJsonKeys),
    navbarCtaLabel: translation.navbarCtaLabel ?? base.navbarCtaLabel,
    heroSubtitle: translation.heroSubtitle ?? base.heroSubtitle,
    heroTitleLine1: translation.heroTitleLine1 ?? base.heroTitleLine1,
    heroTitleLine2: translation.heroTitleLine2 ?? base.heroTitleLine2,
    heroTitleLine3: translation.heroTitleLine3 ?? base.heroTitleLine3,
    heroDescription: translation.heroDescription ?? base.heroDescription,
    heroBadgeValue: translation.heroBadgeValue ?? base.heroBadgeValue,
    heroBadgeLabel: translation.heroBadgeLabel ?? base.heroBadgeLabel,
    ctaTitleLine1: translation.ctaTitleLine1 ?? base.ctaTitleLine1,
    ctaTitleLine2: translation.ctaTitleLine2 ?? base.ctaTitleLine2,
    ctaDescription: translation.ctaDescription ?? base.ctaDescription,
    ctaButtonLabel: translation.ctaButtonLabel ?? base.ctaButtonLabel,
    footerCopyrightText:
      translation.footerCopyrightText ?? base.footerCopyrightText,
  };
}

export async function dbUpsertSiteContentTranslation(
  input: SiteContentLocaleInput,
): Promise<void> {
  await prisma.siteContentSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      ...getBaseColumnValues(defaultSiteContentSettings),
      contentJson: serializeSiteContentConfig(
        defaultSiteContentSettings,
        defaultSiteLocales,
      ),
    },
  });

  await prisma.siteContentTranslation.upsert({
    where: {
      siteContentId_locale: {
        siteContentId: 1,
        locale: input.locale,
      },
    },
    update: {
      contentJson: serializeContentValues(input, localizedJsonKeys),
      navbarCtaLabel: input.navbarCtaLabel,
      heroSubtitle: input.heroSubtitle,
      heroTitleLine1: input.heroTitleLine1,
      heroTitleLine2: input.heroTitleLine2,
      heroTitleLine3: input.heroTitleLine3,
      heroDescription: input.heroDescription,
      heroBadgeValue: input.heroBadgeValue,
      heroBadgeLabel: input.heroBadgeLabel,
      ctaTitleLine1: input.ctaTitleLine1,
      ctaTitleLine2: input.ctaTitleLine2,
      ctaDescription: input.ctaDescription,
      ctaButtonLabel: input.ctaButtonLabel,
      footerCopyrightText: input.footerCopyrightText,
    },
    create: {
      siteContentId: 1,
      locale: input.locale,
      contentJson: serializeContentValues(input, localizedJsonKeys),
      navbarCtaLabel: input.navbarCtaLabel,
      heroSubtitle: input.heroSubtitle,
      heroTitleLine1: input.heroTitleLine1,
      heroTitleLine2: input.heroTitleLine2,
      heroTitleLine3: input.heroTitleLine3,
      heroDescription: input.heroDescription,
      heroBadgeValue: input.heroBadgeValue,
      heroBadgeLabel: input.heroBadgeLabel,
      ctaTitleLine1: input.ctaTitleLine1,
      ctaTitleLine2: input.ctaTitleLine2,
      ctaDescription: input.ctaDescription,
      ctaButtonLabel: input.ctaButtonLabel,
      footerCopyrightText: input.footerCopyrightText,
    },
  });
}
