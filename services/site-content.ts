import "server-only";

export {
  defaultSiteContentSettings,
  defaultSiteLocales,
  getDefaultSiteLocales,
  getHeroSceneLayerOrder,
  getHeroSceneMediaState,
  getHeroSceneTransforms,
  getSiteLocaleCatalog,
  getSiteLocaleFlag,
  getSiteLocaleNativeLabel,
  getSiteLocalePreset,
  inferSiteLocaleDirection,
  inferSiteLocaleLabel,
  isValidSiteLocaleCode,
  normalizeSiteLocaleCode,
  normalizeSiteLocales,
  pickSiteContentLocaleFields,
  SITE_THEME_PRESETS_KEY,
  siteContentTranslationKeys,
  generateStorefrontThemeFromSeed,
  storefrontThemePresets,
} from "@/modules/site-content";
export type {
  HeroSceneMediaState,
  HeroSceneTransforms,
  SiteContentTranslationKey,
  SiteLocalePreset,
  StorefrontThemePreset,
  StorefrontThemeRecipe,
} from "@/modules/site-content";
export {
  getSiteContentSettings,
  getSiteContentTranslation,
  getSiteLocales,
  getSiteThemePresets,
  isSupportedSiteLocale,
  saveSiteContentBundle,
  updateSiteContentSettings,
  updateSiteContentTranslation,
} from "@/modules/site-content/application/service";
