import { unstable_noStore as noStore } from "next/cache";
import {
  dbGetLocalizedSiteContentSettings,
  dbGetSiteContentSettings,
  dbGetSiteLocales,
  dbUpsertSiteContentTranslation,
  dbUpsertSiteContentSettings,
} from "@/db";
import type {
  SiteContentInput,
  SiteContentLocaleInput,
  SiteLocaleConfig,
  SiteContentSettings,
} from "@/types";

export async function getSiteContentSettings(
  locale?: string,
): Promise<SiteContentSettings> {
  noStore();

  if (locale) {
    return dbGetLocalizedSiteContentSettings(locale);
  }

  return dbGetSiteContentSettings();
}

export async function getSiteLocales(): Promise<SiteLocaleConfig[]> {
  noStore();
  return dbGetSiteLocales();
}

export async function isSupportedSiteLocale(locale: string): Promise<boolean> {
  const siteLocales = await getSiteLocales();
  return siteLocales.some((siteLocale) => siteLocale.code === locale);
}

export async function updateSiteContentSettings(
  input: SiteContentInput,
): Promise<SiteContentSettings> {
  return dbUpsertSiteContentSettings(input);
}

export async function updateSiteContentTranslation(
  input: SiteContentLocaleInput,
): Promise<void> {
  return dbUpsertSiteContentTranslation(input);
}
