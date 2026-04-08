import type {
  SiteContentInput,
  SiteContentLocaleInput,
  SiteContentSettings,
  SiteLocaleConfig,
} from "@/types";

export interface SiteContentRepository {
  getSiteContentSettings(): Promise<SiteContentSettings>;
  getLocalizedSiteContentSettings(locale: string): Promise<SiteContentSettings>;
  getSiteLocales(): Promise<SiteLocaleConfig[]>;
  upsertSiteContentSettings(
    input: SiteContentInput,
  ): Promise<SiteContentSettings>;
  upsertSiteContentTranslation(input: SiteContentLocaleInput): Promise<void>;
}
