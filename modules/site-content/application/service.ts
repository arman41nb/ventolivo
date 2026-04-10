import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import type {
  SiteContentBundleInput,
  SiteContentInput,
  SiteContentLocaleFields,
  SiteContentLocaleInput,
  SiteLocaleConfig,
  SiteContentSettings,
} from "@/types";
import { getSiteContentRepository } from "../infrastructure/get-site-content-repository";

export async function getSiteContentSettings(locale?: string): Promise<SiteContentSettings> {
  noStore();

  if (locale) {
    return getSiteContentRepository().getLocalizedSiteContentSettings(locale);
  }

  return getSiteContentRepository().getSiteContentSettings();
}

export async function getSiteLocales(): Promise<SiteLocaleConfig[]> {
  noStore();
  return getSiteContentRepository().getSiteLocales();
}

export async function getSiteContentTranslation(
  locale: string,
): Promise<Partial<SiteContentLocaleFields> | undefined> {
  noStore();
  return getSiteContentRepository().getSiteContentTranslation(locale);
}

export async function isSupportedSiteLocale(locale: string): Promise<boolean> {
  const siteLocales = await getSiteLocales();
  return siteLocales.some((siteLocale) => siteLocale.code === locale);
}

export async function updateSiteContentSettings(
  input: SiteContentInput,
): Promise<SiteContentSettings> {
  return getSiteContentRepository().upsertSiteContentSettings(input);
}

export async function updateSiteContentTranslation(input: SiteContentLocaleInput): Promise<void> {
  return getSiteContentRepository().upsertSiteContentTranslation(input);
}

export async function saveSiteContentBundle(
  input: SiteContentBundleInput,
): Promise<SiteContentSettings> {
  return getSiteContentRepository().saveSiteContentBundle(input);
}
