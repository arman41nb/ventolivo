import type {
  SiteContentBundleInput,
  SiteContentInput,
  SiteContentLocaleFields,
  SiteContentLocaleInput,
  SiteContentSettings,
  SiteLocaleConfig,
  StorefrontThemePreset,
} from "@/types";

export interface SiteContentRepository {
  getSiteContentSettings(): Promise<SiteContentSettings>;
  getLocalizedSiteContentSettings(locale: string): Promise<SiteContentSettings>;
  getSiteContentTranslation(locale: string): Promise<Partial<SiteContentLocaleFields> | undefined>;
  getSiteLocales(): Promise<SiteLocaleConfig[]>;
  getSiteThemePresets(): Promise<StorefrontThemePreset[]>;
  saveSiteContentBundle(input: SiteContentBundleInput): Promise<SiteContentSettings>;
  upsertSiteContentSettings(input: SiteContentInput): Promise<SiteContentSettings>;
  upsertSiteContentTranslation(input: SiteContentLocaleInput): Promise<void>;
}
