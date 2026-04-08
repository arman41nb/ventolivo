import { env } from "@/lib/env";
import {
  defaultSiteContentSettings,
  defaultSiteLocales,
} from "@/modules/site-content/defaults";
import type { SiteContentRepository } from "@/modules/site-content/contracts";
import type {
  SiteContentInput,
  SiteContentLocaleInput,
  SiteContentSettings,
  SiteLocaleConfig,
} from "@/types";

function cloneSiteContentSettings(): SiteContentSettings {
  return { ...defaultSiteContentSettings };
}

function cloneSiteLocales(): SiteLocaleConfig[] {
  return defaultSiteLocales.map((locale) => ({ ...locale }));
}

function createPersistenceError() {
  return new Error(
    "Site content updates require DATABASE_URL so changes can be persisted.",
  );
}

const fallbackSiteContentRepository: SiteContentRepository = {
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

const prismaSiteContentRepository: SiteContentRepository = {
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

export function getSiteContentRepository(): SiteContentRepository {
  return env.DATABASE_URL?.trim()
    ? prismaSiteContentRepository
    : fallbackSiteContentRepository;
}
