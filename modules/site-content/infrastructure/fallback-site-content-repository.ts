import type { SiteContentRepository } from "../domain/contracts";
import { defaultSiteContentSettings, defaultSiteLocales } from "../domain/defaults";

function cloneSiteContentSettings() {
  return { ...defaultSiteContentSettings };
}

function cloneSiteLocales() {
  return defaultSiteLocales.map((locale) => ({ ...locale }));
}

function createPersistenceError() {
  return new Error("Site content updates require DATABASE_URL so changes can be persisted.");
}

export const fallbackSiteContentRepository: SiteContentRepository = {
  async getSiteContentSettings() {
    return cloneSiteContentSettings();
  },
  async getLocalizedSiteContentSettings() {
    return cloneSiteContentSettings();
  },
  async getSiteLocales() {
    return cloneSiteLocales();
  },
  async upsertSiteContentSettings() {
    throw createPersistenceError();
  },
  async upsertSiteContentTranslation() {
    throw createPersistenceError();
  },
};
