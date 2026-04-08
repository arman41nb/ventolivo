import type { SiteContentLocaleFields, SiteContentSettings } from "@/types";

export const siteContentTranslationKeys = [
  "navbarLinkProducts",
  "navbarLinkAbout",
  "navbarLinkContact",
  "navbarCtaLabel",
  "heroSubtitle",
  "heroTitleLine1",
  "heroTitleLine2",
  "heroTitleLine3",
  "heroDescription",
  "heroPrimaryButtonLabel",
  "heroSecondaryButtonLabel",
  "heroBadgeValue",
  "heroBadgeLabel",
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
  "ctaTitleLine1",
  "ctaTitleLine2",
  "ctaDescription",
  "ctaButtonLabel",
  "footerCopyrightText",
] as const;

export type SiteContentTranslationKey = (typeof siteContentTranslationKeys)[number];

export function pickSiteContentLocaleFields(
  settings: SiteContentSettings,
): SiteContentLocaleFields {
  return Object.fromEntries(
    siteContentTranslationKeys.map((key) => [key, settings[key]]),
  ) as SiteContentLocaleFields;
}
