import type {
  SiteContentBundleInput,
  SiteContentInput,
  SiteContentLocaleFields,
  SiteContentLocaleInput,
  SiteContentSettings,
  SiteLocaleConfig,
} from "@/types";

export interface SiteContentRepository {
  getSiteContentSettings(): Promise<SiteContentSettings>;
  getLocalizedSiteContentSettings(locale: string): Promise<SiteContentSettings>;
  getSiteContentTranslation(locale: string): Promise<Partial<SiteContentLocaleFields> | undefined>;
  getSiteLocales(): Promise<SiteLocaleConfig[]>;
  saveSiteContentBundle(input: SiteContentBundleInput): Promise<SiteContentSettings>;
  upsertSiteContentSettings(input: SiteContentInput): Promise<SiteContentSettings>;
  upsertSiteContentTranslation(input: SiteContentLocaleInput): Promise<void>;
}
