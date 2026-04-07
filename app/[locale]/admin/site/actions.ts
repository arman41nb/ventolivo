"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import {
  siteContentLocaleSchema,
  siteContentSchema,
  siteLocalesSchema,
} from "@/lib/validations";
import {
  recordAdminAuditLog,
  requireAdminSession,
} from "@/modules/admin-auth/server";
import {
  getSiteContentSettings,
  getSiteLocales,
  pickSiteContentLocaleFields,
  updateSiteContentSettings,
  updateSiteContentTranslation,
} from "@/modules/site-content";
import type { SiteContentLocaleFields, SiteLocaleConfig } from "@/types";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseSiteLocalesInput(
  formData: FormData,
  fallbackLocales: SiteLocaleConfig[],
): SiteLocaleConfig[] {
  const rawValue = getStringValue(formData, "siteLocalesJson");

  if (!rawValue) {
    return fallbackLocales;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    const result = siteLocalesSchema.safeParse(parsed);

    if (!result.success) {
      throw new Error("Invalid locale registry");
    }

    return result.data.map((locale) => ({
      code: locale.code.trim().toLowerCase(),
      label: locale.label.trim(),
      direction: locale.direction,
    }));
  } catch {
    throw new Error("Invalid locale registry");
  }
}

function parseTranslatedSiteContentInput(
  formData: FormData,
  allowedLocales: Set<string>,
): Partial<Record<string, SiteContentLocaleFields>> {
  const rawValue = getStringValue(formData, "translatedSiteContentJson");

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    const translations: Partial<Record<string, SiteContentLocaleFields>> = {};

    for (const [locale, value] of Object.entries(parsed)) {
      if (!allowedLocales.has(locale)) {
        continue;
      }

      const result = siteContentLocaleSchema.safeParse(value);

      if (!result.success) {
        throw new Error("Invalid translated site content");
      }

      translations[locale] = result.data;
    }

    return translations;
  } catch {
    throw new Error("Invalid translated site content");
  }
}

function getRedirectLocale(
  currentLocale: string,
  siteLocales: SiteLocaleConfig[],
): string {
  return siteLocales.some((locale) => locale.code === currentLocale)
    ? currentLocale
    : defaultLocale;
}

export async function saveSiteContentAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale") || defaultLocale;
  const result = siteContentSchema.safeParse({
    brandName: getStringValue(formData, "brandName"),
    logoMode: getStringValue(formData, "logoMode"),
    logoText: getStringValue(formData, "logoText"),
    logoImageUrl: getStringValue(formData, "logoImageUrl"),
    logoAltText: getStringValue(formData, "logoAltText"),
    navbarLinkProducts: getStringValue(formData, "navbarLinkProducts"),
    navbarLinkAbout: getStringValue(formData, "navbarLinkAbout"),
    navbarLinkContact: getStringValue(formData, "navbarLinkContact"),
    navbarCtaLabel: getStringValue(formData, "navbarCtaLabel"),
    heroSubtitle: getStringValue(formData, "heroSubtitle"),
    heroTitleLine1: getStringValue(formData, "heroTitleLine1"),
    heroTitleLine2: getStringValue(formData, "heroTitleLine2"),
    heroTitleLine3: getStringValue(formData, "heroTitleLine3"),
    heroDescription: getStringValue(formData, "heroDescription"),
    heroPrimaryButtonLabel: getStringValue(formData, "heroPrimaryButtonLabel"),
    heroSecondaryButtonLabel: getStringValue(
      formData,
      "heroSecondaryButtonLabel",
    ),
    heroBadgeValue: getStringValue(formData, "heroBadgeValue"),
    heroBadgeLabel: getStringValue(formData, "heroBadgeLabel"),
    heroImageUrl: getStringValue(formData, "heroImageUrl"),
    heroImageAlt: getStringValue(formData, "heroImageAlt"),
    heroAccentImageUrl: getStringValue(formData, "heroAccentImageUrl"),
    heroAccentImageAlt: getStringValue(formData, "heroAccentImageAlt"),
    heroAccentImageOffsetX: getStringValue(formData, "heroAccentImageOffsetX"),
    heroAccentImageOffsetY: getStringValue(formData, "heroAccentImageOffsetY"),
    heroAccentImageScale: getStringValue(formData, "heroAccentImageScale"),
    heroForegroundMedia: getStringValue(formData, "heroForegroundMedia"),
    heroImageOffsetX: getStringValue(formData, "heroImageOffsetX"),
    heroImageOffsetY: getStringValue(formData, "heroImageOffsetY"),
    heroImageScale: getStringValue(formData, "heroImageScale"),
    stripBannerItem1: getStringValue(formData, "stripBannerItem1"),
    stripBannerItem2: getStringValue(formData, "stripBannerItem2"),
    stripBannerItem3: getStringValue(formData, "stripBannerItem3"),
    stripBannerItem4: getStringValue(formData, "stripBannerItem4"),
    featuredProductsTitle: getStringValue(formData, "featuredProductsTitle"),
    featuredProductsViewAllLabel: getStringValue(
      formData,
      "featuredProductsViewAllLabel",
    ),
    aboutSubtitle: getStringValue(formData, "aboutSubtitle"),
    aboutTitleLine1: getStringValue(formData, "aboutTitleLine1"),
    aboutTitleLine2: getStringValue(formData, "aboutTitleLine2"),
    aboutDescription: getStringValue(formData, "aboutDescription"),
    aboutButtonLabel: getStringValue(formData, "aboutButtonLabel"),
    aboutImageUrl: getStringValue(formData, "aboutImageUrl"),
    aboutImageAlt: getStringValue(formData, "aboutImageAlt"),
    feature1Title: getStringValue(formData, "feature1Title"),
    feature1Text: getStringValue(formData, "feature1Text"),
    feature2Title: getStringValue(formData, "feature2Title"),
    feature2Text: getStringValue(formData, "feature2Text"),
    feature3Title: getStringValue(formData, "feature3Title"),
    feature3Text: getStringValue(formData, "feature3Text"),
    ctaTitleLine1: getStringValue(formData, "ctaTitleLine1"),
    ctaTitleLine2: getStringValue(formData, "ctaTitleLine2"),
    ctaDescription: getStringValue(formData, "ctaDescription"),
    ctaButtonLabel: getStringValue(formData, "ctaButtonLabel"),
    footerCopyrightText: getStringValue(formData, "footerCopyrightText"),
  });

  if (!result.success) {
    throw new Error("Invalid site content form data");
  }

  const [currentBaseSettings, currentSiteLocales] = await Promise.all([
    getSiteContentSettings(),
    getSiteLocales(),
  ]);
  const siteLocales = parseSiteLocalesInput(formData, currentSiteLocales);
  const allowedLocaleCodes = new Set(
    siteLocales.map((siteLocale) => siteLocale.code),
  );
  const translatedContent = parseTranslatedSiteContentInput(
    formData,
    allowedLocaleCodes,
  );
  const currentLocaleFields = pickSiteContentLocaleFields(result.data);
  const translatedDefaultLocale = translatedContent[defaultLocale];

  await updateSiteContentSettings({
    ...currentBaseSettings,
    brandName: result.data.brandName,
    logoMode: result.data.logoMode,
    logoText: result.data.logoText,
    logoImageUrl: result.data.logoImageUrl,
    logoAltText: result.data.logoAltText,
    heroImageUrl: result.data.heroImageUrl,
    heroImageAlt: result.data.heroImageAlt,
    heroAccentImageUrl: result.data.heroAccentImageUrl,
    heroAccentImageAlt: result.data.heroAccentImageAlt,
    heroAccentImageOffsetX: result.data.heroAccentImageOffsetX,
    heroAccentImageOffsetY: result.data.heroAccentImageOffsetY,
    heroAccentImageScale: result.data.heroAccentImageScale,
    heroForegroundMedia: result.data.heroForegroundMedia,
    heroImageOffsetX: result.data.heroImageOffsetX,
    heroImageOffsetY: result.data.heroImageOffsetY,
    heroImageScale: result.data.heroImageScale,
    aboutImageUrl: result.data.aboutImageUrl,
    aboutImageAlt: result.data.aboutImageAlt,
    ...(locale === defaultLocale ? currentLocaleFields : {}),
    ...(translatedDefaultLocale ?? {}),
    siteLocales,
  });

  await updateSiteContentTranslation({
    locale,
    ...currentLocaleFields,
  });

  for (const [targetLocale, translatedFields] of Object.entries(
    translatedContent,
  )) {
    if (!translatedFields || targetLocale === locale) {
      continue;
    }

    await updateSiteContentTranslation({
      locale: targetLocale,
      ...translatedFields,
    });
  }

  await recordAdminAuditLog({
    action: "site-content.updated",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "site-content",
    targetId: "singleton",
    metadata: `Updated site branding and locale content for ${locale}.`,
  });

  const localesToRevalidate = new Set([
    ...currentSiteLocales.map((siteLocale) => siteLocale.code),
    ...siteLocales.map((siteLocale) => siteLocale.code),
  ]);

  for (const currentLocale of localesToRevalidate) {
    revalidatePath(`/${currentLocale}`);
    revalidatePath(`/${currentLocale}/products`);
    revalidatePath(`/${currentLocale}/products/[slug]`, "page");
    revalidatePath(`/${currentLocale}/admin`);
    revalidatePath(`/${currentLocale}/admin/products`);
    revalidatePath(`/${currentLocale}/admin/media`);
    revalidatePath(`/${currentLocale}/admin/site`);
  }

  redirect(`/${getRedirectLocale(locale, siteLocales)}/admin/site?status=updated`);
}
