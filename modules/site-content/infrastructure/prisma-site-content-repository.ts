import type { SiteContentBundleInput, SiteContentInput, SiteContentLocaleInput } from "@/types";
import type { SiteContentRepository } from "../domain/contracts";

export const prismaSiteContentRepository: SiteContentRepository = {
  async getSiteContentSettings() {
    const { dbGetSiteContentSettings } = await import("@/db");
    return dbGetSiteContentSettings();
  },
  async getLocalizedSiteContentSettings(locale) {
    const { dbGetLocalizedSiteContentSettings } = await import("@/db");
    return dbGetLocalizedSiteContentSettings(locale);
  },
  async getSiteLocales() {
    const { dbGetSiteLocales } = await import("@/db");
    return dbGetSiteLocales();
  },
  async getSiteThemePresets() {
    const { dbGetSiteThemePresets } = await import("@/db");
    return dbGetSiteThemePresets();
  },
  async getSiteContentTranslation(locale) {
    const { dbGetSiteContentTranslation } = await import("@/db");
    return dbGetSiteContentTranslation(locale);
  },
  async saveSiteContentBundle(input: SiteContentBundleInput) {
    const { dbSaveSiteContentBundle } = await import("@/db");
    return dbSaveSiteContentBundle(input);
  },
  async upsertSiteContentSettings(input: SiteContentInput) {
    const { dbUpsertSiteContentSettings } = await import("@/db");
    return dbUpsertSiteContentSettings(input);
  },
  async upsertSiteContentTranslation(input: SiteContentLocaleInput) {
    const { dbUpsertSiteContentTranslation } = await import("@/db");
    return dbUpsertSiteContentTranslation(input);
  },
};
