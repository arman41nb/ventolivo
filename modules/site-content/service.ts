import { cache } from "react";
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

export const getSiteContentSettings = cache(
  async (locale?: string): Promise<SiteContentSettings> => {
    if (locale) {
      return dbGetLocalizedSiteContentSettings(locale);
    }

    return dbGetSiteContentSettings();
  },
);

export const getSiteLocales = cache(async (): Promise<SiteLocaleConfig[]> => {
  return dbGetSiteLocales();
});

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
