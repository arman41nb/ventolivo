import type { SiteContentInput, SiteContentLocaleInput } from "@/types";
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
  async upsertSiteContentSettings(input: SiteContentInput) {
    const { dbUpsertSiteContentSettings } = await import("@/db");
    return dbUpsertSiteContentSettings(input);
  },
  async upsertSiteContentTranslation(input: SiteContentLocaleInput) {
    const { dbUpsertSiteContentTranslation } = await import("@/db");
    return dbUpsertSiteContentTranslation(input);
  },
};
