"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { locales } from "@/i18n/config";
import { siteContentSchema } from "@/lib/validations";
import {
  recordAdminAuditLog,
  requireAdminSession,
} from "@/modules/admin-auth/server";
import {
  getSiteContentSettings,
  updateSiteContentSettings,
  updateSiteContentTranslation,
} from "@/modules/site-content";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveSiteContentAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale") || "en";
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
    heroSecondaryButtonLabel: getStringValue(formData, "heroSecondaryButtonLabel"),
    heroBadgeValue: getStringValue(formData, "heroBadgeValue"),
    heroBadgeLabel: getStringValue(formData, "heroBadgeLabel"),
    heroImageUrl: getStringValue(formData, "heroImageUrl"),
    heroImageAlt: getStringValue(formData, "heroImageAlt"),
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

  const currentBaseSettings = await getSiteContentSettings();

  await updateSiteContentSettings({
    ...currentBaseSettings,
    brandName: result.data.brandName,
    logoMode: result.data.logoMode,
    logoText: result.data.logoText,
    logoImageUrl: result.data.logoImageUrl,
    logoAltText: result.data.logoAltText,
    heroImageUrl: result.data.heroImageUrl,
    heroImageAlt: result.data.heroImageAlt,
    aboutImageUrl: result.data.aboutImageUrl,
    aboutImageAlt: result.data.aboutImageAlt,
    ...(locale === "en"
      ? {
          navbarLinkProducts: result.data.navbarLinkProducts,
          navbarLinkAbout: result.data.navbarLinkAbout,
          navbarLinkContact: result.data.navbarLinkContact,
          navbarCtaLabel: result.data.navbarCtaLabel,
          heroSubtitle: result.data.heroSubtitle,
          heroTitleLine1: result.data.heroTitleLine1,
          heroTitleLine2: result.data.heroTitleLine2,
          heroTitleLine3: result.data.heroTitleLine3,
          heroDescription: result.data.heroDescription,
          heroPrimaryButtonLabel: result.data.heroPrimaryButtonLabel,
          heroSecondaryButtonLabel: result.data.heroSecondaryButtonLabel,
          heroBadgeValue: result.data.heroBadgeValue,
          heroBadgeLabel: result.data.heroBadgeLabel,
          stripBannerItem1: result.data.stripBannerItem1,
          stripBannerItem2: result.data.stripBannerItem2,
          stripBannerItem3: result.data.stripBannerItem3,
          stripBannerItem4: result.data.stripBannerItem4,
          featuredProductsTitle: result.data.featuredProductsTitle,
          featuredProductsViewAllLabel: result.data.featuredProductsViewAllLabel,
          aboutSubtitle: result.data.aboutSubtitle,
          aboutTitleLine1: result.data.aboutTitleLine1,
          aboutTitleLine2: result.data.aboutTitleLine2,
          aboutDescription: result.data.aboutDescription,
          aboutButtonLabel: result.data.aboutButtonLabel,
          feature1Title: result.data.feature1Title,
          feature1Text: result.data.feature1Text,
          feature2Title: result.data.feature2Title,
          feature2Text: result.data.feature2Text,
          feature3Title: result.data.feature3Title,
          feature3Text: result.data.feature3Text,
          ctaTitleLine1: result.data.ctaTitleLine1,
          ctaTitleLine2: result.data.ctaTitleLine2,
          ctaDescription: result.data.ctaDescription,
          ctaButtonLabel: result.data.ctaButtonLabel,
          footerCopyrightText: result.data.footerCopyrightText,
        }
      : {}),
  });
  await updateSiteContentTranslation({
    locale,
    navbarLinkProducts: result.data.navbarLinkProducts,
    navbarLinkAbout: result.data.navbarLinkAbout,
    navbarLinkContact: result.data.navbarLinkContact,
    navbarCtaLabel: result.data.navbarCtaLabel,
    heroSubtitle: result.data.heroSubtitle,
    heroTitleLine1: result.data.heroTitleLine1,
    heroTitleLine2: result.data.heroTitleLine2,
    heroTitleLine3: result.data.heroTitleLine3,
    heroDescription: result.data.heroDescription,
    heroPrimaryButtonLabel: result.data.heroPrimaryButtonLabel,
    heroSecondaryButtonLabel: result.data.heroSecondaryButtonLabel,
    heroBadgeValue: result.data.heroBadgeValue,
    heroBadgeLabel: result.data.heroBadgeLabel,
    stripBannerItem1: result.data.stripBannerItem1,
    stripBannerItem2: result.data.stripBannerItem2,
    stripBannerItem3: result.data.stripBannerItem3,
    stripBannerItem4: result.data.stripBannerItem4,
    featuredProductsTitle: result.data.featuredProductsTitle,
    featuredProductsViewAllLabel: result.data.featuredProductsViewAllLabel,
    aboutSubtitle: result.data.aboutSubtitle,
    aboutTitleLine1: result.data.aboutTitleLine1,
    aboutTitleLine2: result.data.aboutTitleLine2,
    aboutDescription: result.data.aboutDescription,
    aboutButtonLabel: result.data.aboutButtonLabel,
    feature1Title: result.data.feature1Title,
    feature1Text: result.data.feature1Text,
    feature2Title: result.data.feature2Title,
    feature2Text: result.data.feature2Text,
    feature3Title: result.data.feature3Title,
    feature3Text: result.data.feature3Text,
    ctaTitleLine1: result.data.ctaTitleLine1,
    ctaTitleLine2: result.data.ctaTitleLine2,
    ctaDescription: result.data.ctaDescription,
    ctaButtonLabel: result.data.ctaButtonLabel,
    footerCopyrightText: result.data.footerCopyrightText,
  });
  await recordAdminAuditLog({
    action: "site-content.updated",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "site-content",
    targetId: "singleton",
    metadata: `Updated site branding and locale content for ${locale}.`,
  });

  for (const currentLocale of locales) {
    revalidatePath(`/${currentLocale}`);
    revalidatePath(`/${currentLocale}/products`);
    revalidatePath(`/${currentLocale}/products/[slug]`, "page");
    revalidatePath(`/${currentLocale}/admin/site`);
  }

  redirect(`/${locale}/admin/site?status=updated`);
}
