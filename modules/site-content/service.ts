import { cache } from "react";
import {
  dbGetLocalizedSiteContentSettings,
  dbGetSiteContentSettings,
  dbUpsertSiteContentTranslation,
  dbUpsertSiteContentSettings,
} from "@/db";
import type {
  SiteContentInput,
  SiteContentLocaleInput,
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
