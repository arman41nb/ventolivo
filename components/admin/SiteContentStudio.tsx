"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SceneImage from "@/components/media/SceneImage";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { useState, type CSSProperties, type ReactNode } from "react";
import HeroVisualStage from "@/components/sections/HeroVisualStage";
import { useFormStatus } from "react-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MediaUploadDropzone from "@/components/admin/MediaUploadDropzone";
import SiteContentTranslationAssistant from "@/components/admin/SiteContentTranslationAssistant";
import SiteLocalesManager from "@/components/admin/SiteLocalesManager";
import SoapStorySection from "@/components/sections/SoapStorySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import { MEDIA_FRAMING_LIMITS } from "@/modules/media";
import ProductGrid from "@/components/products/ProductGrid";
import { siteConfig, socialLinks } from "@/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  getHeroSceneMediaState,
  getHeroSceneTransforms,
  resolveStorefrontContent,
  defaultSiteContentSettings,
  generateStorefrontThemeFromSeed,
  storefrontThemePresets,
  type StorefrontThemePreset,
  type StorefrontThemeRecipe,
} from "@/modules/site-content";
import type {
  EditableFieldId,
  MediaLibraryAsset,
  Product,
  SiteContentSettings,
  SiteLocaleConfig,
  StorefrontThemeSettings,
  StorefrontPreviewBindings,
} from "@/types";

type EditableSectionId =
  | "header"
  | "hero"
  | "story"
  | "strip"
  | "featured"
  | "about"
  | "features"
  | "cta"
  | "footer";

type WorkspacePanelId = "translations" | "languages" | "workflow" | "theme";

type AssetFieldKey = "logoImageUrl" | "heroImageUrl" | "heroAccentImageUrl" | "aboutImageUrl";
type AssetAltFieldKey = "logoAltText" | "heroImageAlt" | "heroAccentImageAlt" | "aboutImageAlt";

type EditableFieldMeta = {
  id: EditableFieldId;
  section: EditableSectionId;
  label: string;
  title: string;
  description: string;
  editor:
    | { type: "input"; key: keyof SiteContentSettings; placeholder?: string }
    | {
        type: "textarea";
        key: keyof SiteContentSettings;
        rows?: number;
        placeholder?: string;
      }
    | { type: "logoText" }
    | {
        type: "asset";
        urlKey: AssetFieldKey;
        altKey: AssetAltFieldKey;
        assetTitle: string;
        helper: string;
      };
};

export interface SiteContentStudioProps {
  locale: Locale;
  action: (formData: FormData) => void | Promise<void>;
  settings: SiteContentSettings;
  themePresets: StorefrontThemePreset[];
  dictionary: Dictionary;
  mediaLibrary: MediaLibraryAsset[];
  featuredProducts: Product[];
  supportedLocales: SiteLocaleConfig[];
  initialWorkspacePanel?: WorkspacePanelId;
  redirectTo?: string;
  studioMode?: "default" | "theme";
}

const sectionLabels: Record<EditableSectionId, string> = {
  header: "Header",
  hero: "Hero",
  story: "Story",
  strip: "Strip banner",
  featured: "Featured products",
  about: "About",
  features: "Features",
  cta: "CTA",
  footer: "Footer",
};

const workspacePanelMeta: Record<
  WorkspacePanelId,
  { label: string; title: string; description: string }
> = {
  translations: {
    label: "Translations",
    title: "Translate the current preview into other locales",
    description:
      "Use auto-translation after editing the active locale, then review everything once before saving.",
  },
  languages: {
    label: "Languages",
    title: "Manage the storefront language registry",
    description: "Add, remove, and tune locale settings without leaving the homepage editor.",
  },
  workflow: {
    label: "Workspace",
    title: "Keep the editing workflow focused",
    description:
      "This workspace keeps translation tools, language settings, and publishing context in one predictable place.",
  },
  theme: {
    label: "Theme",
    title: "Control the storefront design tokens",
    description:
      "Update the global palette from one place. The live preview reflects every token immediately, so the whole storefront stays visually consistent.",
  },
};

const themeFieldGroups: Array<{
  title: string;
  description: string;
  fields: Array<{ key: keyof StorefrontThemeSettings; label: string; helper: string }>;
}> = [
  {
    title: "Canvas",
    description: "These colors define the global page background and the main section surfaces.",
    fields: [
      { key: "themeCanvasStart", label: "Canvas start", helper: "Top of the page background." },
      { key: "themeCanvasMid", label: "Canvas middle", helper: "Middle transition color." },
      { key: "themeCanvasEnd", label: "Canvas end", helper: "Bottom of the page background." },
      { key: "themeSurface", label: "Main surface", helper: "Base panel and soft surface color." },
      { key: "themeSurfaceAlt", label: "Alternate surface", helper: "Warmer contrast surface." },
      { key: "themeSurfaceRaised", label: "Raised surface", helper: "Cards, overlays, and elevated panels." },
    ],
  },
  {
    title: "Brand",
    description: "These tokens drive buttons, highlights, headings, accents, and footer treatment.",
    fields: [
      { key: "themePrimary", label: "Primary brand", helper: "Main brand color for actions and links." },
      { key: "themePrimaryStrong", label: "Primary deep", helper: "Darker stop for gradients and depth." },
      { key: "themeAccent", label: "Accent", helper: "Secondary highlight color used in badges and cues." },
      { key: "themeFooterStart", label: "Footer start", helper: "Top of the footer gradient." },
      { key: "themeFooterEnd", label: "Footer end", helper: "Bottom of the footer gradient." },
    ],
  },
  {
    title: "Typography",
    description: "These tokens keep text contrast predictable across every section.",
    fields: [
      { key: "themeHeading", label: "Heading", helper: "Titles and strong emphasis." },
      { key: "themeText", label: "Body text", helper: "Default readable text color." },
      { key: "themeMuted", label: "Muted text", helper: "Secondary labels and supporting copy." },
      { key: "themeBorder", label: "Border", helper: "Subtle outlines, separators, and chips." },
    ],
  },
];

const themeFieldKeys = themeFieldGroups.flatMap((group) => group.fields.map((field) => field.key));
const MAX_THEME_PRESETS = 24;

function createThemePresetId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `theme-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isHexThemeColor(value: string) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.trim());
}

const editableFields: Record<EditableFieldId, EditableFieldMeta> = {
  brandName: {
    id: "brandName",
    section: "footer",
    label: "Brand name",
    title: "Brand name",
    description: "Used across the storefront and shown in the footer.",
    editor: { type: "input", key: "brandName" },
  },
  logoText: {
    id: "logoText",
    section: "header",
    label: "Logo text",
    title: "Logo text",
    description: "The text version of the logo when the header is in text mode.",
    editor: { type: "logoText" },
  },
  logoImage: {
    id: "logoImage",
    section: "header",
    label: "Logo image",
    title: "Logo image",
    description: "Upload or choose a reusable logo directly from the editor.",
    editor: {
      type: "asset",
      urlKey: "logoImageUrl",
      altKey: "logoAltText",
      assetTitle: "Logo image",
      helper: "Upload a logo, pick one from the library, or use an existing site path.",
    },
  },
  navbarLinkProducts: {
    id: "navbarLinkProducts",
    section: "header",
    label: "Products link",
    title: "Header products link",
    description: "The label for the products link in the top navigation.",
    editor: { type: "input", key: "navbarLinkProducts" },
  },
  navbarLinkAbout: {
    id: "navbarLinkAbout",
    section: "header",
    label: "About link",
    title: "Header about link",
    description: "The label for the about link in the top navigation.",
    editor: { type: "input", key: "navbarLinkAbout" },
  },
  navbarLinkContact: {
    id: "navbarLinkContact",
    section: "header",
    label: "Contact link",
    title: "Header contact link",
    description: "The label for the contact link in the top navigation.",
    editor: { type: "input", key: "navbarLinkContact" },
  },
  navbarCtaLabel: {
    id: "navbarCtaLabel",
    section: "header",
    label: "Header CTA",
    title: "Header CTA button",
    description: "The main action button in the top navigation.",
    editor: { type: "input", key: "navbarCtaLabel" },
  },
  heroSubtitle: {
    id: "heroSubtitle",
    section: "hero",
    label: "Hero subtitle",
    title: "Hero subtitle",
    description: "The small label above the hero headline.",
    editor: { type: "input", key: "heroSubtitle" },
  },
  heroTitleLine1: {
    id: "heroTitleLine1",
    section: "hero",
    label: "Hero line 1",
    title: "Hero headline line 1",
    description: "The first line of the hero headline.",
    editor: { type: "input", key: "heroTitleLine1" },
  },
  heroTitleLine2: {
    id: "heroTitleLine2",
    section: "hero",
    label: "Hero line 2",
    title: "Hero headline line 2",
    description: "The highlighted middle line of the hero headline.",
    editor: { type: "input", key: "heroTitleLine2" },
  },
  heroTitleLine3: {
    id: "heroTitleLine3",
    section: "hero",
    label: "Hero line 3",
    title: "Hero headline line 3",
    description: "The final line of the hero headline.",
    editor: { type: "input", key: "heroTitleLine3" },
  },
  heroDescription: {
    id: "heroDescription",
    section: "hero",
    label: "Hero description",
    title: "Hero description",
    description: "The supporting paragraph beneath the hero headline.",
    editor: { type: "textarea", key: "heroDescription", rows: 4 },
  },
  heroPrimaryButtonLabel: {
    id: "heroPrimaryButtonLabel",
    section: "hero",
    label: "Primary button",
    title: "Hero primary button",
    description: "The main button in the hero section.",
    editor: { type: "input", key: "heroPrimaryButtonLabel" },
  },
  heroSecondaryButtonLabel: {
    id: "heroSecondaryButtonLabel",
    section: "hero",
    label: "Secondary button",
    title: "Hero secondary button",
    description: "The outline button in the hero section.",
    editor: { type: "input", key: "heroSecondaryButtonLabel" },
  },
  heroBadgeValue: {
    id: "heroBadgeValue",
    section: "hero",
    label: "Badge value",
    title: "Hero badge value",
    description: "The large value shown inside the hero badge.",
    editor: { type: "input", key: "heroBadgeValue" },
  },
  heroBadgeLabel: {
    id: "heroBadgeLabel",
    section: "hero",
    label: "Badge label",
    title: "Hero badge label",
    description: "The small caption under the hero badge value.",
    editor: { type: "input", key: "heroBadgeLabel" },
  },
  heroImage: {
    id: "heroImage",
    section: "hero",
    label: "Hero image",
    title: "Hero image",
    description:
      "Upload the main hero image, then fine-tune its framing with live position and scale controls.",
    editor: {
      type: "asset",
      urlKey: "heroImageUrl",
      altKey: "heroImageAlt",
      assetTitle: "Hero image",
      helper:
        "Drop a new hero image here, choose one from the shared library, then adjust its size and position in the live preview.",
    },
  },
  heroAccentImage: {
    id: "heroAccentImage",
    section: "hero",
    label: "Hero accent image",
    title: "Hero accent image",
    description:
      "Upload or replace the secondary hero image that sits beside the main product in the stage.",
    editor: {
      type: "asset",
      urlKey: "heroAccentImageUrl",
      altKey: "heroAccentImageAlt",
      assetTitle: "Hero accent image",
      helper:
        "Use this for the candle or any supporting object that should appear next to the main product.",
    },
  },
  storyEyebrow: {
    id: "storyEyebrow",
    section: "story",
    label: "Story eyebrow",
    title: "Story eyebrow",
    description: "The small label above the story section headline.",
    editor: { type: "input", key: "storyEyebrow" },
  },
  storyTitle: {
    id: "storyTitle",
    section: "story",
    label: "Story title",
    title: "Story title",
    description: "The main title of the nature and ritual section.",
    editor: { type: "textarea", key: "storyTitle", rows: 3 },
  },
  storyLead: {
    id: "storyLead",
    section: "story",
    label: "Story lead",
    title: "Story lead",
    description: "The opening paragraph in the story section.",
    editor: { type: "textarea", key: "storyLead", rows: 3 },
  },
  storyBody: {
    id: "storyBody",
    section: "story",
    label: "Story body",
    title: "Story body",
    description: "The main descriptive paragraph in the story section.",
    editor: { type: "textarea", key: "storyBody", rows: 7 },
  },
  storyClosing: {
    id: "storyClosing",
    section: "story",
    label: "Story closing",
    title: "Story closing quote",
    description: "The closing quote shown in the story section.",
    editor: { type: "textarea", key: "storyClosing", rows: 3 },
  },
  storyRitualLabel: {
    id: "storyRitualLabel",
    section: "story",
    label: "Ritual label",
    title: "Story ritual label",
    description: "The short ritual label used in the story badges.",
    editor: { type: "input", key: "storyRitualLabel" },
  },
  storyMomentsLabel: {
    id: "storyMomentsLabel",
    section: "story",
    label: "Moments label",
    title: "Story moments label",
    description: "The sensory notes label used across the story section.",
    editor: { type: "input", key: "storyMomentsLabel" },
  },
  storyMomentsValue: {
    id: "storyMomentsValue",
    section: "story",
    label: "Moments value",
    title: "Story moments value",
    description: "The sensory notes list shown in the story cards.",
    editor: { type: "textarea", key: "storyMomentsValue", rows: 3 },
  },
  storyDetailLabel: {
    id: "storyDetailLabel",
    section: "story",
    label: "Detail label",
    title: "Story detail label",
    description: "The label above the organic composition note.",
    editor: { type: "input", key: "storyDetailLabel" },
  },
  storyDetailText: {
    id: "storyDetailText",
    section: "story",
    label: "Detail text",
    title: "Story detail text",
    description: "The composition note in the floating detail card.",
    editor: { type: "textarea", key: "storyDetailText", rows: 3 },
  },
  storyStudyLabel: {
    id: "storyStudyLabel",
    section: "story",
    label: "Study label",
    title: "Story study label",
    description: "The label above the sensory study card.",
    editor: { type: "input", key: "storyStudyLabel" },
  },
  storyStudyText: {
    id: "storyStudyText",
    section: "story",
    label: "Study text",
    title: "Story study text",
    description: "The short phrase inside the study card.",
    editor: { type: "input", key: "storyStudyText" },
  },
  stripBannerItem1: {
    id: "stripBannerItem1",
    section: "strip",
    label: "Strip item 1",
    title: "Strip banner item 1",
    description: "The first short statement in the banner under the hero.",
    editor: { type: "input", key: "stripBannerItem1" },
  },
  stripBannerItem2: {
    id: "stripBannerItem2",
    section: "strip",
    label: "Strip item 2",
    title: "Strip banner item 2",
    description: "The second short statement in the strip banner.",
    editor: { type: "input", key: "stripBannerItem2" },
  },
  stripBannerItem3: {
    id: "stripBannerItem3",
    section: "strip",
    label: "Strip item 3",
    title: "Strip banner item 3",
    description: "The third short statement in the strip banner.",
    editor: { type: "input", key: "stripBannerItem3" },
  },
  stripBannerItem4: {
    id: "stripBannerItem4",
    section: "strip",
    label: "Strip item 4",
    title: "Strip banner item 4",
    description: "The fourth short statement in the strip banner.",
    editor: { type: "input", key: "stripBannerItem4" },
  },
  featuredProductsTitle: {
    id: "featuredProductsTitle",
    section: "featured",
    label: "Section title",
    title: "Featured products title",
    description: "The heading above the featured products grid.",
    editor: { type: "input", key: "featuredProductsTitle" },
  },
  featuredProductsViewAllLabel: {
    id: "featuredProductsViewAllLabel",
    section: "featured",
    label: "View all link",
    title: "Featured products link",
    description: "The link that leads visitors to the full products page.",
    editor: { type: "input", key: "featuredProductsViewAllLabel" },
  },
  aboutSubtitle: {
    id: "aboutSubtitle",
    section: "about",
    label: "About subtitle",
    title: "About subtitle",
    description: "The small label above the about headline.",
    editor: { type: "input", key: "aboutSubtitle" },
  },
  aboutTitleLine1: {
    id: "aboutTitleLine1",
    section: "about",
    label: "About line 1",
    title: "About headline line 1",
    description: "The first line of the about headline.",
    editor: { type: "input", key: "aboutTitleLine1" },
  },
  aboutTitleLine2: {
    id: "aboutTitleLine2",
    section: "about",
    label: "About line 2",
    title: "About headline line 2",
    description: "The second line of the about headline.",
    editor: { type: "input", key: "aboutTitleLine2" },
  },
  aboutDescription: {
    id: "aboutDescription",
    section: "about",
    label: "About description",
    title: "About description",
    description: "The main text block in the about section.",
    editor: { type: "textarea", key: "aboutDescription", rows: 5 },
  },
  aboutButtonLabel: {
    id: "aboutButtonLabel",
    section: "about",
    label: "About button",
    title: "About button label",
    description: "The button text in the about section.",
    editor: { type: "input", key: "aboutButtonLabel" },
  },
  aboutImage: {
    id: "aboutImage",
    section: "about",
    label: "About image",
    title: "About image",
    description: "Upload or replace the supporting image in the about section.",
    editor: {
      type: "asset",
      urlKey: "aboutImageUrl",
      altKey: "aboutImageAlt",
      assetTitle: "About image",
      helper: "This image supports the story section and can be reused elsewhere later.",
    },
  },
  feature1Title: {
    id: "feature1Title",
    section: "features",
    label: "Feature 1 title",
    title: "Feature card 1 title",
    description: "The heading of the first features card.",
    editor: { type: "input", key: "feature1Title" },
  },
  feature1Text: {
    id: "feature1Text",
    section: "features",
    label: "Feature 1 text",
    title: "Feature card 1 text",
    description: "The description of the first features card.",
    editor: { type: "textarea", key: "feature1Text", rows: 4 },
  },
  feature2Title: {
    id: "feature2Title",
    section: "features",
    label: "Feature 2 title",
    title: "Feature card 2 title",
    description: "The heading of the second features card.",
    editor: { type: "input", key: "feature2Title" },
  },
  feature2Text: {
    id: "feature2Text",
    section: "features",
    label: "Feature 2 text",
    title: "Feature card 2 text",
    description: "The description of the second features card.",
    editor: { type: "textarea", key: "feature2Text", rows: 4 },
  },
  feature3Title: {
    id: "feature3Title",
    section: "features",
    label: "Feature 3 title",
    title: "Feature card 3 title",
    description: "The heading of the third features card.",
    editor: { type: "input", key: "feature3Title" },
  },
  feature3Text: {
    id: "feature3Text",
    section: "features",
    label: "Feature 3 text",
    title: "Feature card 3 text",
    description: "The description of the third features card.",
    editor: { type: "textarea", key: "feature3Text", rows: 4 },
  },
  ctaTitleLine1: {
    id: "ctaTitleLine1",
    section: "cta",
    label: "CTA line 1",
    title: "CTA headline line 1",
    description: "The first line of the closing call to action.",
    editor: { type: "input", key: "ctaTitleLine1" },
  },
  ctaTitleLine2: {
    id: "ctaTitleLine2",
    section: "cta",
    label: "CTA line 2",
    title: "CTA headline line 2",
    description: "The highlighted second line of the CTA headline.",
    editor: { type: "input", key: "ctaTitleLine2" },
  },
  ctaDescription: {
    id: "ctaDescription",
    section: "cta",
    label: "CTA description",
    title: "CTA description",
    description: "The supporting line above the CTA button.",
    editor: { type: "textarea", key: "ctaDescription", rows: 4 },
  },
  ctaButtonLabel: {
    id: "ctaButtonLabel",
    section: "cta",
    label: "CTA button",
    title: "CTA button label",
    description: "The label on the WhatsApp button.",
    editor: { type: "input", key: "ctaButtonLabel" },
  },
  footerCopyrightText: {
    id: "footerCopyrightText",
    section: "footer",
    label: "Footer copyright",
    title: "Footer copyright",
    description: "The final copyright line shown in the footer.",
    editor: { type: "input", key: "footerCopyrightText" },
  },
};

const featureIcons: ReactNode[] = [
  <svg
    key="feature-icon-clock"
    viewBox="0 0 24 24"
    className="h-4 w-4 stroke-brown fill-none"
    strokeWidth={1.5}
  >
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    <path d="M12 6v6l4 2" />
  </svg>,
  <svg
    key="feature-icon-home"
    viewBox="0 0 24 24"
    className="h-4 w-4 stroke-brown fill-none"
    strokeWidth={1.5}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>,
  <svg
    key="feature-icon-heart"
    viewBox="0 0 24 24"
    className="h-4 w-4 stroke-brown fill-none"
    strokeWidth={1.5}
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>,
];

function PanelInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
      />
    </label>
  );
}

function PanelTextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
      />
    </label>
  );
}

function ThemeColorInput({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-3 rounded-[22px] border border-brown/10 bg-white p-4 shadow-sm">
      <div>
        <p className="text-[12px] uppercase tracking-[0.18em] text-muted">{label}</p>
        <p className="mt-2 text-sm text-text/75">{helper}</p>
      </div>
      <div className="grid grid-cols-[68px_minmax(0,1fr)] items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full cursor-pointer rounded-[14px] border border-brown/12 bg-transparent p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border border-brown/20 bg-cream px-4 py-3 font-mono text-sm uppercase text-dark outline-none transition-colors focus:border-brown"
        />
      </div>
    </label>
  );
}

function ThemePresetCard({
  preset,
  onApply,
  applyLabel = "Apply preset",
  secondaryActionLabel,
  onSecondaryAction,
}: {
  preset: StorefrontThemePreset;
  onApply: () => void;
  applyLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}) {
  const swatches = [
    preset.settings.themePrimary,
    preset.settings.themeAccent,
    preset.settings.themeSurfaceAlt,
    preset.settings.themeHeading,
  ];

  return (
    <article className="rounded-[22px] border border-brown/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-muted">{preset.name}</p>
          <p className="mt-2 text-sm text-text/75">{preset.description}</p>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-brown">
          {preset.recipe}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {swatches.map((swatch) => (
          <span
            key={`${preset.id}-${swatch}`}
            className="h-9 w-9 rounded-full border border-brown/10 shadow-sm"
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApply}
          className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
        >
          {applyLabel}
        </button>
        {onSecondaryAction ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="rounded-full border border-transparent bg-brown/8 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/12"
          >
            {secondaryActionLabel ?? "Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ThemeStatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-[22px] border border-brown/10 bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 font-serif text-3xl text-dark">{value}</p>
      <p className="mt-2 text-sm text-text/70">{note}</p>
    </article>
  );
}

function PanelRange({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
  inputStep,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  inputStep?: number;
}) {
  function handleChange(nextRawValue: string) {
    const nextValue = Number(nextRawValue);

    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  }

  return (
    <label className="grid gap-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-brown shadow-sm">
            {value}
            {suffix}
          </span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
            Min {min}
            {suffix} / Max {max}
            {suffix}
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_110px] md:items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#e7d8c8] accent-[#7a5638]"
        />
        <div className="relative">
          <input
            type="number"
            min={min}
            max={max}
            step={inputStep ?? step}
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            className="w-full rounded-[14px] border border-brown/15 bg-white px-3 py-2 pr-8 text-sm text-brown outline-none transition-colors focus:border-brown"
          />
          {suffix ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.12em] text-muted">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
    </label>
  );
}

function PanelSegmentedControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-3 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-[18px] border px-4 py-3 text-left text-xs uppercase tracking-[0.14em] transition-colors ${
                isActive
                  ? "border-brown bg-brown text-white shadow-sm"
                  : "border-brown/15 bg-white text-brown hover:bg-brown/5"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brown px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
    >
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}

function EditableElement({
  fieldId,
  selectedField,
  onSelect,
  label,
  children,
  className = "",
  badgeAlign = "left",
  contentClassName = "",
  style,
}: {
  fieldId: EditableFieldId;
  selectedField: EditableFieldId;
  onSelect: (field: EditableFieldId) => void;
  label: string;
  children: ReactNode;
  className?: string;
  badgeAlign?: "left" | "right";
  contentClassName?: string;
  style?: CSSProperties;
}) {
  const isSelected = selectedField === fieldId;

  return (
    <button
      type="button"
      onClick={() => onSelect(fieldId)}
      className={`group relative appearance-none border-0 bg-transparent p-0 text-left [font:inherit] text-inherit focus:outline-none ${className}`}
      style={style}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[-6px] rounded-[22px] border transition-all ${
          isSelected
            ? "border-brown/40 bg-brown/5"
            : "border-transparent group-hover:border-brown/25"
        }`}
      />
      <span
        className={`pointer-events-none absolute -top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-brown shadow-sm transition-opacity ${
          badgeAlign === "right" ? "right-0" : "left-0"
        } ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {label}
      </span>
      <span className={`relative block ${contentClassName}`}>{children}</span>
    </button>
  );
}

function mergeAssets(currentAssets: MediaLibraryAsset[], uploadedAssets: MediaLibraryAsset[]) {
  const uploadedIds = new Set(uploadedAssets.map((asset) => asset.id));

  return [...uploadedAssets, ...currentAssets.filter((asset) => !uploadedIds.has(asset.id))];
}

function AssetPicker({
  title,
  helper,
  assets,
  selectedUrl,
  selectedAlt,
  onSelectAsset,
  onClearSelection,
  onAltChange,
  onUrlChange,
  onUploadedAssets,
}: {
  title: string;
  helper: string;
  assets: MediaLibraryAsset[];
  selectedUrl?: string;
  selectedAlt?: string;
  onSelectAsset: (asset: MediaLibraryAsset) => void;
  onClearSelection: () => void;
  onAltChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onUploadedAssets: (assets: MediaLibraryAsset[]) => void;
}) {
  const selectedAsset = assets.find((asset) => asset.url === selectedUrl);

  return (
    <div className="grid gap-5 rounded-[24px] border border-brown/10 bg-cream/35 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">{title}</p>
          <p className="mt-2 text-sm text-text/75">{helper}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedAsset ? (
            <span className="rounded-full bg-olive/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-olive">
              {selectedAsset.label || "Library asset selected"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClearSelection}
            className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.14em] text-brown transition-colors hover:bg-brown/5"
          >
            Clear image
          </button>
        </div>
      </div>

      <MediaUploadDropzone
        title="Upload image"
        description="Drop a new image here or open your files. Uploaded images are also added to the shared library."
        compact
        onUploaded={onUploadedAssets}
      />

      {selectedUrl ? (
        <div className="overflow-hidden rounded-[20px] border border-brown/10 bg-white">
          <img
            src={selectedUrl}
            alt={selectedAlt || title}
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="px-4 py-3 text-xs text-text/70">{selectedAlt || selectedUrl}</div>
        </div>
      ) : null}

      {assets.length > 0 ? (
        <div className="grid max-h-[320px] gap-3 overflow-auto pr-1 sm:grid-cols-2">
          {assets.map((asset) => {
            const isSelected = asset.url === selectedUrl;

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelectAsset(asset)}
                className={`overflow-hidden rounded-[18px] border text-left transition-all ${
                  isSelected
                    ? "border-brown bg-white shadow-sm"
                    : "border-brown/10 bg-white hover:border-brown/25"
                }`}
              >
                <img
                  src={asset.url}
                  alt={asset.altText || asset.label || "Media asset"}
                  className="aspect-video w-full object-cover"
                />
                <div className="space-y-2 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-dark">
                    {asset.label || "Untitled asset"}
                  </p>
                  <p className="text-xs text-text/70">{asset.altText || asset.url}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-brown/20 bg-white px-4 py-5 text-sm text-text/70">
          Your library does not have any uploaded images yet.
        </div>
      )}

      <details className="rounded-[18px] border border-brown/10 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-dark">
          Advanced: manual path or URL
        </summary>
        <div className="grid gap-4 border-t border-brown/10 px-4 py-4">
          <PanelInput
            label="Image path or URL"
            value={selectedUrl}
            onChange={onUrlChange}
            placeholder="/uploads/media/..."
          />
          <PanelInput
            label="Alt text"
            value={selectedAlt}
            onChange={onAltChange}
            placeholder="Describe the image for accessibility"
          />
        </div>
      </details>
    </div>
  );
}

function _PreviewNavbar({
  locale,
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  locale: Locale;
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const links = [
    {
      id: "navbarLinkProducts" as const,
      value: draft.navbarLinkProducts || dictionary.navbar.links.products,
    },
    {
      id: "navbarLinkAbout" as const,
      value: draft.navbarLinkAbout || dictionary.navbar.links.about,
    },
    {
      id: "navbarLinkContact" as const,
      value: draft.navbarLinkContact || dictionary.navbar.links.contact,
    },
  ];

  return (
    <nav className="flex items-center justify-between gap-4 border-b border-brown/[0.15] bg-cream px-[2.5rem] py-[1.2rem]">
      <EditableElement
        fieldId={draft.logoMode === "image" ? "logoImage" : "logoText"}
        selectedField={selectedField}
        onSelect={onSelectField}
        label={draft.logoMode === "image" ? "Logo image" : "Logo text"}
        className="max-w-[240px]"
      >
        {draft.logoMode === "image" && draft.logoImageUrl ? (
          <img
            src={draft.logoImageUrl}
            alt={draft.logoAltText || draft.brandName}
            className="h-10 w-auto object-contain"
          />
        ) : (
          <span className="font-serif text-[22px] font-medium tracking-[2px] text-brown">
            {draft.logoText || "Ventolivo"}
          </span>
        )}
      </EditableElement>

      <div className="flex items-center gap-[1.3rem]">
        {links.map((link) => (
          <EditableElement
            key={link.id}
            fieldId={link.id}
            selectedField={selectedField}
            onSelect={onSelectField}
            label={editableFields[link.id].label}
            className="w-fit"
          >
            <span className="text-[12px] uppercase tracking-[1.5px] text-muted">{link.value}</span>
          </EditableElement>
        ))}
        <span className="rounded-full border border-brown/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown">
          {locale.toUpperCase()}
        </span>
      </div>

      <EditableElement
        fieldId="navbarCtaLabel"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Header CTA"
        badgeAlign="right"
        className="shrink-0"
      >
        <span className="inline-flex bg-brown px-[1.4rem] py-[0.6rem] text-[12px] tracking-[1px] text-white">
          {draft.navbarCtaLabel || dictionary.navbar.cta}
        </span>
      </EditableElement>
    </nav>
  );
}

function _PreviewHero({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const subtitle = draft.heroSubtitle || dictionary.hero.subtitle;
  const title = {
    line1: draft.heroTitleLine1 || dictionary.hero.title.line1,
    line2: draft.heroTitleLine2 || dictionary.hero.title.line2,
    line3: draft.heroTitleLine3 || dictionary.hero.title.line3,
  };
  const description = draft.heroDescription || dictionary.hero.description;
  const primaryButton = draft.heroPrimaryButtonLabel || dictionary.hero.shopNow;
  const secondaryButton = draft.heroSecondaryButtonLabel || dictionary.hero.ourStory;
  const badgeValue = draft.heroBadgeValue || dictionary.hero.badge.value;
  const badgeLabel = draft.heroBadgeLabel || dictionary.hero.badge.label;
  const brandName = draft.brandName || siteConfig.name;
  const processTitle = draft.feature1Title || dictionary.features.items.coldProcess.title;
  const processText = draft.feature1Text || dictionary.features.items.coldProcess.text;
  const batchTitle = draft.feature2Title || dictionary.features.items.smallBatches.title;
  const naturalTitle = draft.feature3Title || dictionary.features.items.natural.title;
  const naturalText = draft.feature3Text || dictionary.features.items.natural.text;
  const heroMedia = getHeroSceneMediaState(draft, brandName);
  const heroScene = getHeroSceneTransforms(0, heroMedia);
  const trustPills = [
    { id: "feature3Title" as const, value: naturalTitle },
    { id: "feature2Title" as const, value: batchTitle },
    { id: "feature1Title" as const, value: processTitle },
  ];

  return (
    <section className="px-4 pb-5 pt-4 md:px-6 md:pt-5">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[42px] border border-white/55 bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(244,236,228,0.94))] shadow-[0_28px_90px_rgba(109,82,58,0.14)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.95),transparent_20%),radial-gradient(circle_at_82%_15%,rgba(255,255,255,0.7),transparent_16%),radial-gradient(circle_at_50%_88%,rgba(198,178,156,0.2),transparent_22%)]" />
        <span className="ambient-orb left-10 top-10 h-28 w-28 bg-white/52" />
        <span className="ambient-orb bottom-10 left-[48%] h-24 w-24 bg-[#d9c4a7]/20 [animation-delay:1.2s]" />
        <span className="ambient-orb right-16 top-16 h-24 w-24 bg-white/34 [animation-delay:2s]" />

        <div className="relative grid gap-10 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(620px,1.2fr)] lg:items-center lg:gap-4 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
          <div className="relative z-10 flex flex-col justify-center lg:pe-6">
            <div className="flex flex-wrap items-center gap-3">
              <EditableElement
                fieldId="heroSubtitle"
                selectedField={selectedField}
                onSelect={onSelectField}
                label="Hero subtitle"
                className="w-fit"
              >
                <span className="inline-flex items-center gap-3 rounded-full border border-brown/8 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#9c826a] shadow-[0_10px_25px_rgba(72,49,30,0.05)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {subtitle}
                </span>
              </EditableElement>

              <div className="inline-flex items-center gap-1 rounded-full border border-brown/8 bg-white/74 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#9c826a]">
                <EditableElement
                  fieldId="heroBadgeValue"
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label="Badge value"
                  className="w-fit"
                >
                  <span>{badgeValue}</span>
                </EditableElement>
                <EditableElement
                  fieldId="heroBadgeLabel"
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label="Badge label"
                  className="w-fit"
                >
                  <span>{badgeLabel}</span>
                </EditableElement>
              </div>
            </div>

            <div className="mt-6 max-w-[620px]">
              <h1 className="font-serif text-[3.55rem] leading-[0.88] tracking-[-0.03em] text-[#3f2c1f] md:text-[5.1rem] xl:text-[6.3rem]">
                <EditableElement
                  fieldId="heroTitleLine1"
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label="Hero line 1"
                  className="mb-1 w-fit"
                >
                  <span className="block">{title.line1}</span>
                </EditableElement>
                <EditableElement
                  fieldId="heroTitleLine2"
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label="Hero line 2"
                  className="mb-1 w-fit"
                >
                  <em className="block font-medium italic text-[#a07d62]">{title.line2}</em>
                </EditableElement>
                <EditableElement
                  fieldId="heroTitleLine3"
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label="Hero line 3"
                  className="w-fit"
                >
                  <span className="block">{title.line3}</span>
                </EditableElement>
              </h1>

              <EditableElement
                fieldId="heroDescription"
                selectedField={selectedField}
                onSelect={onSelectField}
                label="Hero description"
                className="mt-8 max-w-[430px]"
              >
                <p className="text-[15px] leading-[1.9] text-[#6f5a49] md:text-[17px]">
                  {description}
                </p>
              </EditableElement>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <EditableElement
                fieldId="heroPrimaryButtonLabel"
                selectedField={selectedField}
                onSelect={onSelectField}
                label="Primary button"
                className="w-fit"
              >
                <span className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(93,61,39,0.18)]">
                  {primaryButton}
                </span>
              </EditableElement>
              <EditableElement
                fieldId="heroSecondaryButtonLabel"
                selectedField={selectedField}
                onSelect={onSelectField}
                label="Secondary button"
                className="w-fit"
              >
                <span className="inline-flex items-center justify-center rounded-full border border-brown/8 bg-white/84 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-[#8a6b52] shadow-[0_10px_24px_rgba(72,49,30,0.05)]">
                  {secondaryButton}
                </span>
              </EditableElement>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustPills.map((pill) => (
                <EditableElement
                  key={pill.id}
                  fieldId={pill.id}
                  selectedField={selectedField}
                  onSelect={onSelectField}
                  label={editableFields[pill.id].label}
                  className="w-fit"
                >
                  <span className="rounded-full border border-brown/8 bg-white/74 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#a18a75] shadow-[0_8px_22px_rgba(72,49,30,0.04)]">
                    {pill.value}
                  </span>
                </EditableElement>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[500px] lg:min-h-[680px]">
            <div className="grid h-full min-h-[500px] gap-5 sm:grid-cols-[minmax(0,1fr)_230px] sm:items-stretch lg:min-h-[680px] lg:gap-7">
              <HeroVisualStage
                brandName={brandName}
                media={heroMedia}
                transforms={heroScene}
                renderAccentImage={(content, props) => (
                  <EditableElement
                    fieldId="heroAccentImage"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Hero accent image"
                    className={props.className}
                    contentClassName={props.contentClassName}
                    style={props.style}
                  >
                    {content}
                  </EditableElement>
                )}
                renderHeroImage={(content, props) => (
                  <EditableElement
                    fieldId="heroImage"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Hero image"
                    className={props.className}
                    contentClassName={props.contentClassName}
                    style={props.style}
                  >
                    {content}
                  </EditableElement>
                )}
                renderBrandBadge={(content, props) => (
                  <EditableElement
                    fieldId="brandName"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Brand name"
                    className={props.className}
                    contentClassName={props.contentClassName}
                    style={props.style}
                  >
                    {content}
                  </EditableElement>
                )}
              />
              <div className="relative z-30 flex flex-col justify-center gap-6 pb-[16%] pt-[20%] sm:py-[18%] lg:py-[20%]">
                <div
                  className="rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,246,0.96),rgba(248,243,237,0.84))] p-5 shadow-[0_22px_45px_rgba(105,81,61,0.08)] backdrop-blur-xl transition-transform duration-300"
                  style={{ transform: heroScene.processCardTransform }}
                >
                  <EditableElement
                    fieldId="feature1Title"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Feature 1 title"
                    className="w-fit"
                  >
                    <div>
                      <small className="block text-[11px] uppercase tracking-[0.18em] text-[#c2a78f]">
                        {processTitle}
                      </small>
                      <strong className="mt-3 block font-serif text-[2rem] leading-none text-[#96755d]">
                        {processTitle}
                      </strong>
                    </div>
                  </EditableElement>
                  <EditableElement
                    fieldId="feature1Text"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Feature 1 text"
                    className="mt-4 block"
                  >
                    <p className="text-[13px] leading-[1.95] text-[#806b59]">{processText}</p>
                  </EditableElement>
                </div>

                <div
                  className="rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,248,246,0.96),rgba(247,239,235,0.86))] p-5 shadow-[0_22px_45px_rgba(105,81,61,0.08)] backdrop-blur-xl transition-transform duration-300"
                  style={{ transform: heroScene.naturalCardTransform }}
                >
                  <div className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-[#c2a78f]">
                    <EditableElement
                      fieldId="heroBadgeValue"
                      selectedField={selectedField}
                      onSelect={onSelectField}
                      label="Badge value"
                      className="w-fit"
                    >
                      <span>{badgeValue}</span>
                    </EditableElement>
                    <EditableElement
                      fieldId="heroBadgeLabel"
                      selectedField={selectedField}
                      onSelect={onSelectField}
                      label="Badge label"
                      className="w-fit"
                    >
                      <span>{badgeLabel}</span>
                    </EditableElement>
                  </div>
                  <EditableElement
                    fieldId="feature3Title"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Feature 3 title"
                    className="mt-3 w-fit"
                  >
                    <strong className="block font-serif text-[2rem] leading-none text-[#96755d]">
                      {naturalTitle}
                    </strong>
                  </EditableElement>
                  <EditableElement
                    fieldId="feature3Text"
                    selectedField={selectedField}
                    onSelect={onSelectField}
                    label="Feature 3 text"
                    className="mt-4 block"
                  >
                    <p className="text-[13px] leading-[1.95] text-[#806b59]">{naturalText}</p>
                  </EditableElement>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function _PreviewStripBanner({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const items = [
    {
      id: "stripBannerItem1" as const,
      value: draft.stripBannerItem1 || dictionary.stripBanner.items[0],
    },
    {
      id: "stripBannerItem2" as const,
      value: draft.stripBannerItem2 || dictionary.stripBanner.items[1],
    },
    {
      id: "stripBannerItem3" as const,
      value: draft.stripBannerItem3 || dictionary.stripBanner.items[2],
    },
    {
      id: "stripBannerItem4" as const,
      value: draft.stripBannerItem4 || dictionary.stripBanner.items[3],
    },
  ];

  return (
    <section className="bg-brown px-[2.5rem] py-[0.8rem]">
      <div className="flex flex-wrap justify-center gap-[2.2rem]">
        {items.map((item) => (
          <EditableElement
            key={item.id}
            fieldId={item.id}
            selectedField={selectedField}
            onSelect={onSelectField}
            label={editableFields[item.id].label}
            className="w-fit"
          >
            <span className="text-[11px] uppercase tracking-[1.5px] text-white/[0.8]">
              - {item.value}
            </span>
          </EditableElement>
        ))}
      </div>
    </section>
  );
}

function _PreviewFeaturedProducts({
  locale,
  dictionary,
  draft,
  selectedField,
  onSelectField,
  featuredProducts,
}: {
  locale: Locale;
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
  featuredProducts: Product[];
}) {
  return (
    <section className="px-[2.5rem] py-[4rem]">
      <div className="mb-[2.5rem] flex items-baseline justify-between">
        <EditableElement
          fieldId="featuredProductsTitle"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Section title"
          className="w-fit"
        >
          <h2 className="font-serif text-[36px] text-dark">
            {draft.featuredProductsTitle || dictionary.featuredProducts.title}
          </h2>
        </EditableElement>
        <EditableElement
          fieldId="featuredProductsViewAllLabel"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="View all link"
          badgeAlign="right"
          className="w-fit"
        >
          <span className="border-b border-brown text-[12px] tracking-[1px] text-brown">
            {draft.featuredProductsViewAllLabel || dictionary.featuredProducts.viewAll}
          </span>
        </EditableElement>
      </div>
      <div className="pointer-events-none">
        <ProductGrid
          products={featuredProducts}
          orderLabel={dictionary.products.card.orderVia}
          locale={locale}
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
        Product cards stay connected to the Products manager.
      </p>
    </section>
  );
}

function _PreviewAbout({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  return (
    <section className="grid grid-cols-1 items-center gap-[4rem] bg-warm px-[2.5rem] py-[4rem] md:grid-cols-2">
      <EditableElement
        fieldId="aboutImage"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="About image"
        className="block"
      >
        <SceneImage
          src={draft.aboutImageUrl}
          alt={draft.aboutImageAlt || draft.brandName}
          label="About image"
          hint="Choose or upload the image from the editor panel."
          imageClassName="aspect-[4/3] w-full object-cover"
          placeholderClassName="aspect-[4/3]"
        />
      </EditableElement>

      <div>
        <EditableElement
          fieldId="aboutSubtitle"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="About subtitle"
          className="mb-[1rem] w-fit"
        >
          <p className="text-[11px] uppercase tracking-[2px] text-olive">
            {draft.aboutSubtitle || dictionary.about.subtitle}
          </p>
        </EditableElement>
        <h2 className="mb-[1.5rem] font-serif text-[38px] leading-[1.2] text-dark">
          <EditableElement
            fieldId="aboutTitleLine1"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="About line 1"
            className="mb-1 w-fit"
          >
            <span>{draft.aboutTitleLine1 || dictionary.about.title.line1}</span>
          </EditableElement>
          <EditableElement
            fieldId="aboutTitleLine2"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="About line 2"
            className="w-fit"
          >
            <span>{draft.aboutTitleLine2 || dictionary.about.title.line2}</span>
          </EditableElement>
        </h2>
        <EditableElement
          fieldId="aboutDescription"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="About description"
          className="mb-[2rem] max-w-[420px]"
        >
          <p className="text-[14px] leading-[1.9] text-muted">
            {draft.aboutDescription || dictionary.about.description}
          </p>
        </EditableElement>
        <EditableElement
          fieldId="aboutButtonLabel"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="About button"
          className="w-fit"
        >
          <span className="inline-flex border border-brown px-[1.6rem] py-[0.8rem] text-[12px] uppercase tracking-[0.14em] text-brown">
            {draft.aboutButtonLabel || dictionary.about.learnMore}
          </span>
        </EditableElement>
      </div>
    </section>
  );
}

function _PreviewFeatures({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const items = [
    {
      titleId: "feature1Title" as const,
      textId: "feature1Text" as const,
      title: draft.feature1Title || dictionary.features.items.coldProcess.title,
      text: draft.feature1Text || dictionary.features.items.coldProcess.text,
      icon: featureIcons[0],
    },
    {
      titleId: "feature2Title" as const,
      textId: "feature2Text" as const,
      title: draft.feature2Title || dictionary.features.items.smallBatches.title,
      text: draft.feature2Text || dictionary.features.items.smallBatches.text,
      icon: featureIcons[1],
    },
    {
      titleId: "feature3Title" as const,
      textId: "feature3Text" as const,
      title: draft.feature3Title || dictionary.features.items.natural.title,
      text: draft.feature3Text || dictionary.features.items.natural.text,
      icon: featureIcons[2],
    },
  ];

  return (
    <section className="grid grid-cols-1 border-t border-brown/[0.15] md:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.titleId}
          className={`p-[2.5rem] ${index < items.length - 1 ? "border-r border-brown/[0.15]" : ""}`}
        >
          <div className="mb-[1rem] flex h-[32px] w-[32px] items-center justify-center border border-brown">
            {item.icon}
          </div>
          <EditableElement
            fieldId={item.titleId}
            selectedField={selectedField}
            onSelect={onSelectField}
            label={editableFields[item.titleId].label}
            className="mb-[0.5rem] w-fit"
          >
            <p className="font-serif text-[18px] text-dark">{item.title}</p>
          </EditableElement>
          <EditableElement
            fieldId={item.textId}
            selectedField={selectedField}
            onSelect={onSelectField}
            label={editableFields[item.textId].label}
            className="w-full"
          >
            <p className="text-[13px] leading-[1.7] text-muted">{item.text}</p>
          </EditableElement>
        </div>
      ))}
    </section>
  );
}

function _PreviewCTA({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  return (
    <section className="bg-dark px-[2.5rem] py-[4rem] text-center">
      <h2 className="mb-[1rem] font-serif text-[42px] leading-[1.2] text-cream">
        <EditableElement
          fieldId="ctaTitleLine1"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="CTA line 1"
          className="mx-auto mb-1 w-fit"
        >
          <span>{draft.ctaTitleLine1 || dictionary.cta.title.line1}</span>
        </EditableElement>
        <EditableElement
          fieldId="ctaTitleLine2"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="CTA line 2"
          className="mx-auto w-fit"
        >
          <em className="italic text-[#C5B49A]">
            {draft.ctaTitleLine2 || dictionary.cta.title.line2}
          </em>
        </EditableElement>
      </h2>

      <EditableElement
        fieldId="ctaDescription"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="CTA description"
        className="mx-auto mb-[2rem] max-w-[420px]"
      >
        <p className="text-[13px] tracking-[1px] text-white/[0.5]">
          {draft.ctaDescription || dictionary.cta.description}
        </p>
      </EditableElement>

      <EditableElement
        fieldId="ctaButtonLabel"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="CTA button"
        className="mx-auto w-fit"
      >
        <span className="inline-flex items-center gap-[10px] bg-[#25D366] px-[2.2rem] py-[0.9rem] text-[13px] tracking-[1px] text-white">
          {draft.ctaButtonLabel || dictionary.cta.button}
        </span>
      </EditableElement>
    </section>
  );
}

function _PreviewFooter({
  draft,
  selectedField,
  onSelectField,
}: {
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const brandName = draft.brandName || siteConfig.name;

  return (
    <footer className="flex items-center justify-between gap-6 border-t border-brown/[0.15] bg-white px-[2.5rem] py-[2rem]">
      <EditableElement
        fieldId="brandName"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Brand name"
        className="w-fit"
      >
        <span className="font-serif text-[18px] text-brown">{brandName}</span>
      </EditableElement>

      <EditableElement
        fieldId="footerCopyrightText"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Footer copyright"
        className="max-w-[440px]"
      >
        <p className="text-[12px] text-muted">
          &copy; {new Date().getFullYear()} {brandName}. {draft.footerCopyrightText}
        </p>
      </EditableElement>

      <nav className="flex gap-[1rem]">
        {socialLinks.map((link) => (
          <span key={link.label} className="text-[11px] uppercase tracking-[1px] text-muted">
            {link.label}
          </span>
        ))}
      </nav>
    </footer>
  );
}

export default function SiteContentStudio({
  locale,
  action,
  settings,
  themePresets,
  dictionary,
  mediaLibrary,
  featuredProducts,
  supportedLocales,
  initialWorkspacePanel = "translations",
  redirectTo,
  studioMode = "default",
}: SiteContentStudioProps) {
  const [selectedField, setSelectedField] = useState<EditableFieldId>("heroTitleLine1");
  const [activeWorkspacePanel, setActiveWorkspacePanel] =
    useState<WorkspacePanelId>(initialWorkspacePanel);
  const [draft, setDraft] = useState<SiteContentSettings>(settings);
  const [assets, setAssets] = useState(mediaLibrary);
  const [savedThemePresets, setSavedThemePresets] = useState(themePresets);
  const [themeSeedColor, setThemeSeedColor] = useState(settings.themePrimary);
  const [themeRecipe, setThemeRecipe] = useState<StorefrontThemeRecipe>("balanced");
  const [themePresetName, setThemePresetName] = useState("");
  const [themePresetDescription, setThemePresetDescription] = useState("");
  const [themeJsonDraft, setThemeJsonDraft] = useState("");
  const [themeJsonStatus, setThemeJsonStatus] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message: "",
  });
  const selectedMeta = editableFields[selectedField];
  const relatedFields = Object.values(editableFields).filter(
    (field) => field.section === selectedMeta.section && field.id !== selectedField,
  );
  const imageAssets = assets.filter((asset) => asset.kind === "image");
  const activeWorkspace = workspacePanelMeta[activeWorkspacePanel];
  const isThemeStudio = studioMode === "theme";
  const storefrontContent = resolveStorefrontContent(dictionary, draft);
  const effectiveThemeSeedColor = isHexThemeColor(themeSeedColor)
    ? themeSeedColor
    : draft.themePrimary;
  const generatedThemePreview = generateStorefrontThemeFromSeed(
    effectiveThemeSeedColor,
    themeRecipe,
  );
  const currentThemeSwatches = [
    { label: "Primary", value: draft.themePrimary },
    { label: "Accent", value: draft.themeAccent },
    { label: "Surface", value: draft.themeSurface },
    { label: "Heading", value: draft.themeHeading },
    { label: "Footer", value: draft.themeFooterEnd },
  ];

  function updateField<Key extends keyof SiteContentSettings>(
    key: Key,
    value: SiteContentSettings[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function handleSelectField(field: EditableFieldId) {
    setSelectedField(field);
  }

  function handleRestoreDraft() {
    setDraft(settings);
    setAssets(mediaLibrary);
    setActiveWorkspacePanel(initialWorkspacePanel);
    setSavedThemePresets(themePresets);
    setThemeSeedColor(settings.themePrimary);
    setThemeRecipe("balanced");
    setThemePresetName("");
    setThemePresetDescription("");
    setThemeJsonDraft("");
    setThemeJsonStatus({ tone: "idle", message: "" });
  }

  function handleResetTheme() {
    setDraft((currentDraft) => {
      const nextDraft = { ...currentDraft };

      for (const key of themeFieldKeys) {
        nextDraft[key] = defaultSiteContentSettings[key];
      }

      return nextDraft;
    });
    setThemeSeedColor(defaultSiteContentSettings.themePrimary);
    setThemeRecipe("balanced");
  }

  function applyThemeSettings(themeSettings: StorefrontThemeSettings) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...themeSettings,
    }));
  }

  function handleApplyPreset(preset: StorefrontThemePreset) {
    applyThemeSettings(preset.settings);
    setThemeSeedColor(preset.settings.themePrimary);
    setThemeRecipe(preset.recipe);
  }

  function handleGenerateThemeFromSeed() {
    applyThemeSettings(generatedThemePreview);
  }

  function createThemeSettingsSnapshot(source: SiteContentSettings): StorefrontThemeSettings {
    const snapshot = {} as StorefrontThemeSettings;

    for (const key of themeFieldKeys) {
      snapshot[key] = source[key];
    }

    return snapshot;
  }

  function handleSaveCurrentThemePreset() {
    const trimmedName = themePresetName.trim();

    if (!trimmedName) {
      setThemeJsonStatus({
        tone: "error",
        message: "Preset name is required before saving.",
      });
      return;
    }

    if (savedThemePresets.length >= MAX_THEME_PRESETS) {
      setThemeJsonStatus({
        tone: "error",
        message: `You can store up to ${MAX_THEME_PRESETS} custom presets. Export or delete one before adding more.`,
      });
      return;
    }

    const nextPreset: StorefrontThemePreset = {
      id: createThemePresetId(),
      name: trimmedName,
      description: themePresetDescription.trim(),
      recipe: themeRecipe,
      settings: createThemeSettingsSnapshot(draft),
    };

    setSavedThemePresets((currentPresets) => [nextPreset, ...currentPresets]);
    setThemePresetName("");
    setThemePresetDescription("");
    setThemeJsonStatus({
      tone: "success",
      message: `Preset "${trimmedName}" is ready and will be saved when you save the page.`,
    });
  }

  function handleDeleteThemePreset(presetId: string) {
    setSavedThemePresets((currentPresets) =>
      currentPresets.filter((preset) => preset.id !== presetId),
    );
    setThemeJsonStatus({
      tone: "success",
      message: "Preset removed from the current draft library.",
    });
  }

  function handleExportCurrentTheme() {
    setThemeJsonDraft(
      JSON.stringify(
        {
          kind: "storefront-theme",
          version: 1,
          recipe: themeRecipe,
          settings: createThemeSettingsSnapshot(draft),
        },
        null,
        2,
      ),
    );
    setThemeJsonStatus({
      tone: "success",
      message: "Current theme JSON is ready in the import/export box.",
    });
  }

  function handleExportThemeLibrary() {
    setThemeJsonDraft(
      JSON.stringify(
        {
          kind: "storefront-theme-library",
          version: 1,
          currentTheme: {
            recipe: themeRecipe,
            settings: createThemeSettingsSnapshot(draft),
          },
          presets: savedThemePresets,
        },
        null,
        2,
      ),
    );
    setThemeJsonStatus({
      tone: "success",
      message: "Theme library JSON is ready in the import/export box.",
    });
  }

  function isThemeSettingsCandidate(value: unknown): value is StorefrontThemeSettings {
    if (!value || typeof value !== "object") {
      return false;
    }

    return themeFieldKeys.every((key) => typeof (value as Record<string, unknown>)[key] === "string");
  }

  function isThemePresetCandidate(value: unknown): value is StorefrontThemePreset {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.description === "string" &&
      (candidate.recipe === "balanced" ||
        candidate.recipe === "soft" ||
        candidate.recipe === "bold") &&
      isThemeSettingsCandidate(candidate.settings)
    );
  }

  function handleImportThemeJson() {
    try {
      const parsed = JSON.parse(themeJsonDraft) as unknown;

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Theme JSON must be an object.");
      }

      const candidate = parsed as Record<string, unknown>;

      if (candidate.kind === "storefront-theme" && isThemeSettingsCandidate(candidate.settings)) {
        applyThemeSettings(candidate.settings);
        setThemeRecipe(
          candidate.recipe === "soft" || candidate.recipe === "bold"
            ? candidate.recipe
            : "balanced",
        );
        setThemeSeedColor(candidate.settings.themePrimary);
        setThemeJsonStatus({
          tone: "success",
          message: "Theme JSON imported into the live draft.",
        });
        return;
      }

      if (candidate.kind === "storefront-theme-library") {
        const currentTheme = candidate.currentTheme as Record<string, unknown> | undefined;
        const presets = Array.isArray(candidate.presets) ? candidate.presets : [];

        if (
          currentTheme &&
          isThemeSettingsCandidate(currentTheme.settings) &&
          (currentTheme.recipe === "balanced" ||
            currentTheme.recipe === "soft" ||
            currentTheme.recipe === "bold")
        ) {
          applyThemeSettings(currentTheme.settings);
          setThemeRecipe(currentTheme.recipe);
          setThemeSeedColor(currentTheme.settings.themePrimary);
        }

        if (!presets.every((preset) => isThemePresetCandidate(preset))) {
          throw new Error("One or more presets are invalid.");
        }

        if (presets.length > MAX_THEME_PRESETS) {
          throw new Error(`Theme libraries can include up to ${MAX_THEME_PRESETS} presets.`);
        }

        setSavedThemePresets(presets);
        setThemeJsonStatus({
          tone: "success",
          message: "Theme library JSON imported into the live draft.",
        });
        return;
      }

      throw new Error("Unsupported theme JSON format.");
    } catch (error) {
      setThemeJsonStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Theme JSON import failed.",
      });
    }
  }

  const previewBindings: StorefrontPreviewBindings = {
    renderEditable: ({
      fieldId,
      label,
      children,
      className = "",
      badgeAlign = "left",
      contentClassName = "",
      style,
    }) => (
      <EditableElement
        fieldId={fieldId}
        selectedField={selectedField}
        onSelect={handleSelectField}
        label={label}
        className={className}
        badgeAlign={badgeAlign}
        contentClassName={contentClassName}
        style={style}
      >
        {children}
      </EditableElement>
    ),
  };

  function applyUploadedAsset(
    uploadedAssets: MediaLibraryAsset[],
    urlKey: AssetFieldKey,
    altKey: AssetAltFieldKey,
  ) {
    setAssets((currentAssets) => mergeAssets(currentAssets, uploadedAssets));

    const uploadedAsset = uploadedAssets[0];
    if (!uploadedAsset) {
      return;
    }

    updateField(urlKey, uploadedAsset.url as SiteContentSettings[typeof urlKey]);
    updateField(
      altKey,
      (uploadedAsset.altText ||
        uploadedAsset.label ||
        draft.brandName ||
        "") as SiteContentSettings[typeof altKey],
    );
  }

  function renderFieldEditor() {
    const editor = selectedMeta.editor;

    if (editor.type === "input") {
      return (
        <PanelInput
          label={selectedMeta.title}
          value={draft[editor.key] as string | undefined}
          placeholder={editor.placeholder}
          onChange={(value) =>
            updateField(editor.key, value as SiteContentSettings[typeof editor.key])
          }
        />
      );
    }

    if (editor.type === "textarea") {
      return (
        <PanelTextArea
          label={selectedMeta.title}
          rows={editor.rows}
          value={draft[editor.key] as string | undefined}
          placeholder={editor.placeholder}
          onChange={(value) =>
            updateField(editor.key, value as SiteContentSettings[typeof editor.key])
          }
        />
      );
    }

    if (editor.type === "logoText") {
      return (
        <div className="grid gap-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Logo mode</span>
            <select
              value={draft.logoMode}
              onChange={(event) =>
                updateField("logoMode", event.target.value === "image" ? "image" : "text")
              }
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            >
              <option value="text">Text logo</option>
              <option value="image">Image logo</option>
            </select>
          </label>
          <PanelInput
            label="Logo text"
            value={draft.logoText}
            onChange={(value) => updateField("logoText", value)}
          />
        </div>
      );
    }

    return (
      <div className="grid gap-5">
        {editor.urlKey === "logoImageUrl" ? (
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Logo mode</span>
            <select
              value={draft.logoMode}
              onChange={(event) =>
                updateField("logoMode", event.target.value === "image" ? "image" : "text")
              }
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            >
              <option value="text">Text logo</option>
              <option value="image">Image logo</option>
            </select>
          </label>
        ) : null}
        <AssetPicker
          title={editor.assetTitle}
          helper={editor.helper}
          assets={imageAssets}
          selectedUrl={draft[editor.urlKey] as string | undefined}
          selectedAlt={draft[editor.altKey] as string | undefined}
          onSelectAsset={(asset) => {
            updateField(editor.urlKey, asset.url as SiteContentSettings[typeof editor.urlKey]);
            updateField(
              editor.altKey,
              (asset.altText ||
                asset.label ||
                draft.brandName ||
                "") as SiteContentSettings[typeof editor.altKey],
            );
          }}
          onClearSelection={() => {
            updateField(editor.urlKey, "" as SiteContentSettings[typeof editor.urlKey]);
            updateField(editor.altKey, "" as SiteContentSettings[typeof editor.altKey]);
          }}
          onAltChange={(value) =>
            updateField(editor.altKey, value as SiteContentSettings[typeof editor.altKey])
          }
          onUrlChange={(value) =>
            updateField(editor.urlKey, value as SiteContentSettings[typeof editor.urlKey])
          }
          onUploadedAssets={(uploadedAssets) =>
            applyUploadedAsset(uploadedAssets, editor.urlKey, editor.altKey)
          }
        />
        {editor.urlKey === "heroImageUrl" ? (
          <div className="grid gap-4 rounded-[24px] border border-brown/10 bg-cream/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-muted">Hero framing</p>
                <p className="mt-2 text-sm text-text/75">
                  Tune the product placement directly from this panel and watch the live preview
                  update instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateField("heroImageOffsetX", MEDIA_FRAMING_LIMITS.offset.defaultValue);
                  updateField("heroImageOffsetY", MEDIA_FRAMING_LIMITS.offset.defaultValue);
                  updateField("heroImageScale", MEDIA_FRAMING_LIMITS.scale.defaultValue);
                }}
                className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.14em] text-brown transition-colors hover:bg-brown/5"
              >
                Reset framing
              </button>
            </div>

            <PanelRange
              label="Horizontal position"
              min={MEDIA_FRAMING_LIMITS.offset.min}
              max={MEDIA_FRAMING_LIMITS.offset.max}
              step={MEDIA_FRAMING_LIMITS.offset.step}
              value={draft.heroImageOffsetX ?? MEDIA_FRAMING_LIMITS.offset.defaultValue}
              onChange={(value) => updateField("heroImageOffsetX", value)}
            />
            <PanelRange
              label="Vertical position"
              min={MEDIA_FRAMING_LIMITS.offset.min}
              max={MEDIA_FRAMING_LIMITS.offset.max}
              step={MEDIA_FRAMING_LIMITS.offset.step}
              value={draft.heroImageOffsetY ?? MEDIA_FRAMING_LIMITS.offset.defaultValue}
              onChange={(value) => updateField("heroImageOffsetY", value)}
            />
            <PanelRange
              label="Image scale"
              min={MEDIA_FRAMING_LIMITS.scale.min}
              max={MEDIA_FRAMING_LIMITS.scale.max}
              step={MEDIA_FRAMING_LIMITS.scale.step}
              value={draft.heroImageScale ?? MEDIA_FRAMING_LIMITS.scale.defaultValue}
              suffix="%"
              inputStep={1}
              onChange={(value) => updateField("heroImageScale", value)}
            />
            <PanelSegmentedControl
              label="Layer order"
              value={draft.heroForegroundMedia}
              onChange={(value) =>
                updateField("heroForegroundMedia", value === "accent" ? "accent" : "hero")
              }
              options={[
                { label: "Main image on top", value: "hero" },
                { label: "Accent image on top", value: "accent" },
              ]}
            />
          </div>
        ) : null}
        {editor.urlKey === "heroAccentImageUrl" ? (
          <div className="grid gap-4 rounded-[24px] border border-brown/10 bg-cream/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-muted">Accent framing</p>
                <p className="mt-2 text-sm text-text/75">
                  Move the candle freely inside the live preview so the storefront mock stays close
                  to the final hero composition.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateField("heroAccentImageOffsetX", MEDIA_FRAMING_LIMITS.offset.defaultValue);
                  updateField("heroAccentImageOffsetY", MEDIA_FRAMING_LIMITS.offset.defaultValue);
                  updateField("heroAccentImageScale", MEDIA_FRAMING_LIMITS.scale.defaultValue);
                }}
                className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.14em] text-brown transition-colors hover:bg-brown/5"
              >
                Reset accent
              </button>
            </div>

            <PanelRange
              label="Horizontal position"
              min={MEDIA_FRAMING_LIMITS.offset.min}
              max={MEDIA_FRAMING_LIMITS.offset.max}
              step={MEDIA_FRAMING_LIMITS.offset.step}
              value={draft.heroAccentImageOffsetX ?? MEDIA_FRAMING_LIMITS.offset.defaultValue}
              onChange={(value) => updateField("heroAccentImageOffsetX", value)}
            />
            <PanelRange
              label="Vertical position"
              min={MEDIA_FRAMING_LIMITS.offset.min}
              max={MEDIA_FRAMING_LIMITS.offset.max}
              step={MEDIA_FRAMING_LIMITS.offset.step}
              value={draft.heroAccentImageOffsetY ?? MEDIA_FRAMING_LIMITS.offset.defaultValue}
              onChange={(value) => updateField("heroAccentImageOffsetY", value)}
            />
            <PanelRange
              label="Accent scale"
              min={MEDIA_FRAMING_LIMITS.scale.min}
              max={MEDIA_FRAMING_LIMITS.scale.max}
              step={MEDIA_FRAMING_LIMITS.scale.step}
              value={draft.heroAccentImageScale ?? MEDIA_FRAMING_LIMITS.scale.defaultValue}
              suffix="%"
              inputStep={1}
              onChange={(value) => updateField("heroAccentImageScale", value)}
            />
            <PanelSegmentedControl
              label="Layer order"
              value={draft.heroForegroundMedia}
              onChange={(value) =>
                updateField("heroForegroundMedia", value === "accent" ? "accent" : "hero")
              }
              options={[
                { label: "Main image on top", value: "hero" },
                { label: "Accent image on top", value: "accent" },
              ]}
            />
          </div>
        ) : null}
      </div>
    );
  }

  function renderWorkspacePanel() {
    if (activeWorkspacePanel === "translations") {
      return (
        <SiteContentTranslationAssistant
          currentLocale={locale}
          locales={supportedLocales}
          dictionary={dictionary.admin.siteTranslationAssistant}
        />
      );
    }

    if (activeWorkspacePanel === "languages") {
      return (
        <SiteLocalesManager
          currentLocale={locale}
          locales={supportedLocales}
          dictionary={dictionary.admin.siteLocalesManager}
        />
      );
    }

    if (activeWorkspacePanel === "theme") {
      return (
        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Theme studio</p>
              <h3 className="mt-2 font-serif text-2xl text-dark">
                Drive the storefront palette from semantic tokens
              </h3>
              <p className="mt-3 text-sm text-text/75">
                These tokens control the whole storefront system: page background, surfaces,
                buttons, accents, typography, borders, and footer. Because the theme is centralized,
                future presets and advanced modes can build on the same structure.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetTheme}
              className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Reset theme
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {themeFieldKeys.length} design tokens
            </span>
            <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
              Live preview linked
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {storefrontThemePresets.length} ready presets
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {savedThemePresets.length} saved presets
            </span>
          </div>

          {themeJsonStatus.tone !== "idle" ? (
            <div
              className={`mt-6 rounded-[22px] border px-4 py-3 text-sm ${
                themeJsonStatus.tone === "success"
                  ? "border-olive/20 bg-olive/10 text-olive"
                  : "border-[#d96b5f]/20 bg-[#d96b5f]/10 text-[#9f3e33]"
              }`}
            >
              {themeJsonStatus.message}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6">
            <section className="rounded-[26px] border border-brown/10 bg-cream/35 p-5">
              <p className="text-[12px] uppercase tracking-[0.2em] text-muted">Preset library</p>
              <p className="mt-2 text-sm text-text/75">
                Start from a professionally balanced palette, then fine-tune the tokens if you want
                something more custom.
              </p>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {storefrontThemePresets.map((preset) => (
                  <ThemePresetCard
                    key={preset.id}
                    preset={preset}
                    onApply={() => handleApplyPreset(preset)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-brown/10 bg-cream/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                    Saved custom presets
                  </p>
                  <p className="mt-2 text-sm text-text/75">
                    Capture the current token set as a reusable preset for this storefront. These
                    presets are saved together with the site settings when you save the page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveCurrentThemePreset}
                  className="rounded-full bg-brown px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                >
                  Save current as preset
                </button>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div className="grid gap-4">
                  <PanelInput
                    label="Preset name"
                    value={themePresetName}
                    placeholder="Olive Boutique"
                    onChange={setThemePresetName}
                  />
                  <PanelTextArea
                    label="Preset description"
                    rows={4}
                    value={themePresetDescription}
                    placeholder="Warm olive and cream direction for spring launches."
                    onChange={setThemePresetDescription}
                  />
                  <p className="text-sm text-text/70">
                    Capacity: {savedThemePresets.length}/{MAX_THEME_PRESETS} custom presets.
                  </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {savedThemePresets.length > 0 ? (
                    savedThemePresets.map((preset) => (
                      <ThemePresetCard
                        key={preset.id}
                        preset={preset}
                        onApply={() => handleApplyPreset(preset)}
                        applyLabel="Apply custom"
                        secondaryActionLabel="Delete preset"
                        onSecondaryAction={() => handleDeleteThemePreset(preset.id)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-brown/20 bg-white px-5 py-6 text-sm text-text/70 xl:col-span-2">
                      No custom presets yet. Tune the current palette, name it, then save it here.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-brown/10 bg-cream/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                    Palette generator
                  </p>
                  <p className="mt-2 text-sm text-text/75">
                    Pick one base color and let the studio generate the rest of the palette around
                    it. This is useful when you already know the brand color but do not want to
                    handcraft every surface and text token.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateThemeFromSeed}
                  className="rounded-full bg-brown px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                >
                  Generate palette
                </button>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="grid gap-4">
                  <ThemeColorInput
                    label="Seed color"
                    helper="The generator will use this as the main brand anchor."
                    value={themeSeedColor}
                    onChange={setThemeSeedColor}
                  />
                  <PanelSegmentedControl
                    label="Palette mood"
                    value={themeRecipe}
                    onChange={(value) =>
                      setThemeRecipe(
                        value === "soft" || value === "bold" ? value : "balanced",
                      )
                    }
                    options={[
                      { label: "Balanced", value: "balanced" },
                      { label: "Soft", value: "soft" },
                      { label: "Bold", value: "bold" },
                    ]}
                  />
                </div>

                <div className="rounded-[22px] border border-brown/10 bg-white p-4 shadow-sm">
                  <p className="text-[12px] uppercase tracking-[0.18em] text-muted">
                    Generated preview
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        themeSeedColor,
                        generatedThemePreview.themeAccent,
                        generatedThemePreview.themeSurface,
                        generatedThemePreview.themeHeading,
                        generatedThemePreview.themeFooterEnd,
                      ].map((swatch, index) => (
                        <div key={`${swatch}-${index}`} className="grid gap-2">
                          <div
                            className="h-12 rounded-[16px] border border-brown/10 shadow-sm"
                            style={{ backgroundColor: swatch }}
                          />
                          <p className="truncate text-[10px] uppercase tracking-[0.14em] text-muted">
                            {index === 0
                              ? "Seed"
                              : index === 1
                                ? "Accent"
                                : index === 2
                                  ? "Surface"
                                  : index === 3
                                    ? "Heading"
                                    : "Footer"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-text/75">
                      `Balanced` keeps the palette close to the seed, `Soft` creates a lighter
                      boutique feel, and `Bold` pushes contrast for a stronger brand statement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-brown/10 bg-cream/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                    Import and export
                  </p>
                  <p className="mt-2 text-sm text-text/75">
                    Export the active theme or the full preset library as JSON, or paste a JSON
                    payload to import it back into the live draft.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleExportCurrentTheme}
                    className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    Export theme
                  </button>
                  <button
                    type="button"
                    onClick={handleExportThemeLibrary}
                    className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    Export library
                  </button>
                  <button
                    type="button"
                    onClick={handleImportThemeJson}
                    className="rounded-full bg-brown px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                  >
                    Import JSON
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <PanelTextArea
                  label="Theme JSON"
                  rows={14}
                  value={themeJsonDraft}
                  placeholder='{\n  "kind": "storefront-theme",\n  "version": 1,\n  "recipe": "balanced",\n  "settings": { ... }\n}'
                  onChange={setThemeJsonDraft}
                />
                <p className="text-sm text-text/70">
                  Supported formats: `storefront-theme` for a single theme and
                  `storefront-theme-library` for the active theme plus custom presets.
                </p>
              </div>
            </section>

            {themeFieldGroups.map((group) => (
              <section
                key={group.title}
                className="rounded-[26px] border border-brown/10 bg-cream/35 p-5"
              >
                <p className="text-[12px] uppercase tracking-[0.2em] text-muted">{group.title}</p>
                <p className="mt-2 text-sm text-text/75">{group.description}</p>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {group.fields.map((field) => (
                    <ThemeColorInput
                      key={field.key}
                      label={field.label}
                      helper={field.helper}
                      value={draft[field.key]}
                      onChange={(value) => updateField(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
        <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Publishing flow</p>
        <h3 className="mt-2 font-serif text-2xl text-dark">
          Keep the homepage edits calm and reviewable
        </h3>
        <p className="mt-3 text-sm text-text/75">
          Pick the exact field from the preview, make the change on the right, stage translations or
          locale edits only when needed, then save once. This keeps the content workflow predictable
          even as the panel grows.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
            {imageAssets.length} reusable images
          </span>
          <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
            {supportedLocales.length} storefront languages
          </span>
          <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
            Single-save publishing flow
          </span>
        </div>
      </section>
    );
  }

  const defaultEditorPanel = (
    <>
      <section className="sticky top-0 z-20 rounded-[24px] border border-brown/15 bg-[#f7f0e6]/96 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-brown/12 bg-white/92 px-4 py-3 shadow-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Editor actions</p>
            <p className="mt-1 text-sm text-text/70">
              Save the current draft or restore the last saved version.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Redo
            </button>
            <SubmitButton />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-brown/15 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Selected field</p>
            <h2 className="mt-2 font-serif text-3xl text-dark">{selectedMeta.title}</h2>
            <p className="mt-2 text-sm text-text/75">{selectedMeta.description}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
            Area: {sectionLabels[selectedMeta.section]}
          </span>
          <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
            Locale: {locale}
          </span>
        </div>

        {relatedFields.length > 0 ? (
          <div className="mt-6">
            <p className="text-[12px] uppercase tracking-[0.18em] text-muted">Nearby items</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => handleSelectField(field.id)}
                  className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-brown/15 bg-white p-6 shadow-sm">
        {renderFieldEditor()}
      </section>

      <section className="rounded-[28px] border border-brown/15 bg-white p-6 shadow-sm">
        <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Workspace</p>
        <h3 className="mt-2 font-serif text-2xl text-dark">{activeWorkspace.title}</h3>
        <p className="mt-3 text-sm text-text/75">{activeWorkspace.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(
            Object.entries(workspacePanelMeta) as Array<
              [WorkspacePanelId, (typeof workspacePanelMeta)[WorkspacePanelId]]
            >
          ).map(([panelId, panel]) => (
            <button
              key={panelId}
              type="button"
              onClick={() => setActiveWorkspacePanel(panelId)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                activeWorkspacePanel === panelId
                  ? "border-brown bg-brown text-white"
                  : "border-brown/20 bg-white text-brown hover:bg-brown/5"
              }`}
            >
              {panel.label}
            </button>
          ))}
        </div>
      </section>

      {renderWorkspacePanel()}
    </>
  );

  const themeEditorPanel = (
    <>
      <section className="sticky top-0 z-20 rounded-[24px] border border-brown/15 bg-[#f7f0e6]/96 p-3 backdrop-blur">
        <div className="rounded-[20px] border border-brown/12 bg-white/92 px-4 py-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Theme console</p>
          <h2 className="mt-2 font-serif text-3xl text-dark">Build a storefront identity</h2>
          <p className="mt-2 text-sm text-text/70">
            This page is dedicated to the visual system only: brand palette, reusable presets, and
            import/export workflows for the whole storefront.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Restore draft
            </button>
            <SubmitButton />
            <Link
              href={`/${locale}/admin/site`}
              className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Open content studio
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
        <ThemeStatCard
          label="Design tokens"
          value={String(themeFieldKeys.length)}
          note="Semantic colors drive every shared surface, CTA, border, and text state."
        />
        <ThemeStatCard
          label="Custom presets"
          value={String(savedThemePresets.length)}
          note="Saved brand directions you can reapply without rebuilding the palette."
        />
        <ThemeStatCard
          label="Current recipe"
          value={themeRecipe}
          note="The active palette mood used by the seed-color generator."
        />
      </section>

      <section className="rounded-[28px] border border-brown/15 bg-white p-6 shadow-sm">
        <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Current palette</p>
        <h3 className="mt-2 font-serif text-2xl text-dark">Live brand snapshot</h3>
        <p className="mt-3 text-sm text-text/75">
          These are the key anchors currently shaping the storefront preview.
        </p>
        <div className="mt-5 grid grid-cols-5 gap-3">
          {currentThemeSwatches.map((swatch) => (
            <div key={swatch.label} className="grid gap-2">
              <div
                className="h-14 rounded-[16px] border border-brown/10 shadow-sm"
                style={{ backgroundColor: swatch.value }}
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  {swatch.label}
                </p>
                <p className="mt-1 truncate font-mono text-xs text-text/75">{swatch.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {renderWorkspacePanel()}
    </>
  );

  const editorPanel = isThemeStudio ? themeEditorPanel : defaultEditorPanel;

  return (
    <form
      action={action}
      className={`grid gap-6 ${
        isThemeStudio
          ? "xl:grid-cols-[minmax(0,1.08fr)_520px]"
          : "xl:grid-cols-[minmax(0,1fr)_430px]"
      }`}
    >
      <input type="hidden" name="locale" value={locale} />
      {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
      <input type="hidden" name="themePresetsJson" value={JSON.stringify(savedThemePresets)} />
      {(
        Object.entries(draft) as Array<
          [keyof SiteContentSettings, SiteContentSettings[keyof SiteContentSettings]]
        >
      ).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value ?? ""} />
      ))}

      <section className="rounded-[32px] border border-brown/15 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              {isThemeStudio ? "Theme preview" : "Live preview"}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              {isThemeStudio
                ? "See the whole storefront respond to the active palette"
                : "Edit the homepage by clicking the exact element"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text/75">
              {isThemeStudio
                ? "Use the preview as a live brand review surface. Every token update, preset, and imported theme is reflected here immediately across navigation, hero, cards, and footer."
                : "The preview covers the full homepage flow. Click any text, image, or button and the right side will jump straight to the matching field instead of making you hunt for it manually."}
            </p>
          </div>
          {isThemeStudio ? (
            <div className="flex flex-wrap gap-2">
              {currentThemeSwatches.map((swatch) => (
                <span
                  key={`header-${swatch.label}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-brown"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-brown/10"
                    style={{ backgroundColor: swatch.value }}
                  />
                  {swatch.label}
                </span>
              ))}
            </div>
          ) : (
            <Link
              href={`/${locale}/admin/media`}
              className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Open media library
            </Link>
          )}
        </div>

        {isThemeStudio ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] border border-brown/10 bg-cream/35 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Canvas system</p>
              <p className="mt-2 text-sm text-text/75">
                Background and section surfaces stay harmonized across the full page.
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/35 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Action system</p>
              <p className="mt-2 text-sm text-text/75">
                Primary actions, highlights, and accents inherit one connected brand direction.
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/35 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Type system</p>
              <p className="mt-2 text-sm text-text/75">
                Heading, body, and muted text keep readable contrast while following the palette.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Selected: {selectedMeta.title}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Area: {sectionLabels[selectedMeta.section]}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Locale: {locale}
            </span>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-[28px] border border-brown/10 bg-[#f5ede2]">
          <div className="flex items-center gap-2 border-b border-brown/10 bg-[#efe1ce] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#d96b5f]" />
            <span className="h-3 w-3 rounded-full bg-[#d9a65f]" />
            <span className="h-3 w-3 rounded-full bg-[#84b36a]" />
            <span className="ml-3 text-xs uppercase tracking-[0.18em] text-brown/80">
              Storefront preview
            </span>
          </div>

          <div className="max-h-[calc(100vh-260px)] overflow-auto bg-[#fbf7f1] p-4">
            <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[30px] border border-brown/10 bg-[#f8f3ed] shadow-[0_22px_50px_rgba(71,49,30,0.08)]">
              <StorefrontThemeScope settings={draft} className="page-shell min-h-screen bg-transparent">
                <Navbar
                  locale={locale}
                  brand={{
                    name: storefrontContent.brandName,
                    logoMode: draft.logoMode,
                    logoText: draft.logoText,
                    logoImageUrl: draft.logoImageUrl,
                    logoAltText: draft.logoAltText,
                  }}
                  content={storefrontContent.navbar}
                  supportedLocales={supportedLocales}
                  accountLabels={dictionary.account.nav}
                  preview={previewBindings}
                />
                <main>
                  <Hero
                    locale={locale}
                    siteSettings={draft}
                    content={{ ...storefrontContent.hero, ...storefrontContent.features }}
                    preview={previewBindings}
                  />
                  <SoapStorySection
                    siteSettings={draft}
                    content={storefrontContent.storySection}
                    previewMode
                    preview={previewBindings}
                  />
                  <FeaturedProducts
                    locale={locale}
                    title={storefrontContent.featuredProducts.title}
                    viewAllLabel={storefrontContent.featuredProducts.viewAllLabel}
                    orderLabel={storefrontContent.featuredProducts.orderLabel}
                    products={featuredProducts}
                    preview={previewBindings}
                  />
                  <AboutSection
                    siteSettings={draft}
                    content={storefrontContent.about}
                    preview={previewBindings}
                  />
                  <FeaturesGrid
                    content={storefrontContent.features}
                    preview={previewBindings}
                  />
                  <CTASection
                    content={storefrontContent.cta}
                    preview={previewBindings}
                  />
                </main>
                <Footer
                  brandName={storefrontContent.brandName}
                  content={storefrontContent.footer}
                  locale={locale}
                  preview={previewBindings}
                />
              </StorefrontThemeScope>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-6 self-start rounded-[32px] border border-brown/15 bg-[#f7f0e6]/96 p-4 shadow-[0_24px_60px_rgba(71,49,30,0.12)] backdrop-blur xl:sticky xl:top-8 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
        {editorPanel}
      </aside>
    </form>
  );
}
