export type HeroForegroundMedia = "hero" | "accent";
export type StorefrontThemeRecipe = "balanced" | "soft" | "bold";

export interface StorefrontThemePreset {
  id: string;
  name: string;
  description: string;
  recipe: StorefrontThemeRecipe;
  settings: StorefrontThemeSettings;
}

export interface StorefrontThemeSettings {
  themeCanvasStart: string;
  themeCanvasMid: string;
  themeCanvasEnd: string;
  themeSurface: string;
  themeSurfaceAlt: string;
  themeSurfaceRaised: string;
  themePrimary: string;
  themePrimaryStrong: string;
  themeAccent: string;
  themeText: string;
  themeHeading: string;
  themeMuted: string;
  themeBorder: string;
  themeFooterStart: string;
  themeFooterEnd: string;
}

export interface SiteContentSettings extends StorefrontThemeSettings {
  brandName: string;
  logoMode: "text" | "image";
  logoText: string;
  logoImageUrl?: string;
  logoAltText?: string;
  navbarLinkProducts: string;
  navbarLinkAbout: string;
  navbarLinkContact: string;
  navbarCtaLabel: string;
  heroSubtitle: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleLine3: string;
  heroDescription: string;
  heroPrimaryButtonLabel: string;
  heroSecondaryButtonLabel: string;
  heroBadgeValue: string;
  heroBadgeLabel: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroAccentImageUrl?: string;
  heroAccentImageAlt?: string;
  heroAccentImageOffsetX: number;
  heroAccentImageOffsetY: number;
  heroAccentImageScale: number;
  heroForegroundMedia: HeroForegroundMedia;
  heroImageOffsetX: number;
  heroImageOffsetY: number;
  heroImageScale: number;
  storyEyebrow: string;
  storyTitle: string;
  storyLead: string;
  storyBody: string;
  storyClosing: string;
  storyRitualLabel: string;
  storyMomentsLabel: string;
  storyMomentsValue: string;
  storyDetailLabel: string;
  storyDetailText: string;
  storyStudyLabel: string;
  storyStudyText: string;
  stripBannerItem1: string;
  stripBannerItem2: string;
  stripBannerItem3: string;
  stripBannerItem4: string;
  featuredProductsTitle: string;
  featuredProductsViewAllLabel: string;
  aboutSubtitle: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutDescription: string;
  aboutButtonLabel: string;
  aboutImageUrl?: string;
  aboutImageAlt?: string;
  feature1Title: string;
  feature1Text: string;
  feature2Title: string;
  feature2Text: string;
  feature3Title: string;
  feature3Text: string;
  ctaTitleLine1: string;
  ctaTitleLine2: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  footerCopyrightText: string;
}

export type SiteLocaleDirection = "ltr" | "rtl";

export interface SiteLocaleConfig {
  code: string;
  label: string;
  direction: SiteLocaleDirection;
}

export interface SiteContentInput extends SiteContentSettings {
  siteLocales?: SiteLocaleConfig[];
  siteThemePresets?: StorefrontThemePreset[];
}

export interface SiteContentBundleInput {
  settings: SiteContentInput;
  translations: SiteContentLocaleInput[];
}

export interface SiteContentLocaleInput {
  locale: string;
  navbarLinkProducts: string;
  navbarLinkAbout: string;
  navbarLinkContact: string;
  navbarCtaLabel: string;
  heroSubtitle: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleLine3: string;
  heroDescription: string;
  heroPrimaryButtonLabel: string;
  heroSecondaryButtonLabel: string;
  heroBadgeValue: string;
  heroBadgeLabel: string;
  storyEyebrow: string;
  storyTitle: string;
  storyLead: string;
  storyBody: string;
  storyClosing: string;
  storyRitualLabel: string;
  storyMomentsLabel: string;
  storyMomentsValue: string;
  storyDetailLabel: string;
  storyDetailText: string;
  storyStudyLabel: string;
  storyStudyText: string;
  stripBannerItem1: string;
  stripBannerItem2: string;
  stripBannerItem3: string;
  stripBannerItem4: string;
  featuredProductsTitle: string;
  featuredProductsViewAllLabel: string;
  aboutSubtitle: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutDescription: string;
  aboutButtonLabel: string;
  feature1Title: string;
  feature1Text: string;
  feature2Title: string;
  feature2Text: string;
  feature3Title: string;
  feature3Text: string;
  ctaTitleLine1: string;
  ctaTitleLine2: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  footerCopyrightText: string;
}

export type SiteContentLocaleFields = Omit<SiteContentLocaleInput, "locale">;
