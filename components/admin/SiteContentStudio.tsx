"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import MediaUploadDropzone from "@/components/admin/MediaUploadDropzone";
import SiteContentTranslationAssistant from "@/components/admin/SiteContentTranslationAssistant";
import SiteLocalesManager from "@/components/admin/SiteLocalesManager";
import ProductGrid from "@/components/products/ProductGrid";
import { siteConfig, socialLinks } from "@/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type {
  MediaLibraryAsset,
  Product,
  SiteContentSettings,
  SiteLocaleConfig,
} from "@/types";

type EditableSectionId =
  | "header"
  | "hero"
  | "strip"
  | "featured"
  | "about"
  | "features"
  | "cta"
  | "footer";

type WorkspacePanelId = "translations" | "languages" | "workflow";

type EditableFieldId =
  | "brandName"
  | "logoText"
  | "logoImage"
  | "navbarLinkProducts"
  | "navbarLinkAbout"
  | "navbarLinkContact"
  | "navbarCtaLabel"
  | "heroSubtitle"
  | "heroTitleLine1"
  | "heroTitleLine2"
  | "heroTitleLine3"
  | "heroDescription"
  | "heroPrimaryButtonLabel"
  | "heroSecondaryButtonLabel"
  | "heroBadgeValue"
  | "heroBadgeLabel"
  | "heroImage"
  | "stripBannerItem1"
  | "stripBannerItem2"
  | "stripBannerItem3"
  | "stripBannerItem4"
  | "featuredProductsTitle"
  | "featuredProductsViewAllLabel"
  | "aboutSubtitle"
  | "aboutTitleLine1"
  | "aboutTitleLine2"
  | "aboutDescription"
  | "aboutButtonLabel"
  | "aboutImage"
  | "feature1Title"
  | "feature1Text"
  | "feature2Title"
  | "feature2Text"
  | "feature3Title"
  | "feature3Text"
  | "ctaTitleLine1"
  | "ctaTitleLine2"
  | "ctaDescription"
  | "ctaButtonLabel"
  | "footerCopyrightText";

type AssetFieldKey = "logoImageUrl" | "heroImageUrl" | "aboutImageUrl";
type AssetAltFieldKey = "logoAltText" | "heroImageAlt" | "aboutImageAlt";

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
  dictionary: Dictionary;
  mediaLibrary: MediaLibraryAsset[];
  featuredProducts: Product[];
  supportedLocales: SiteLocaleConfig[];
}

const sectionLabels: Record<EditableSectionId, string> = {
  header: "Header",
  hero: "Hero",
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
    description:
      "Add, remove, and tune locale settings without leaving the homepage editor.",
  },
  workflow: {
    label: "Workspace",
    title: "Keep the editing workflow focused",
    description:
      "This workspace keeps translation tools, language settings, and publishing context in one predictable place.",
  },
};

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
      helper:
        "Upload a logo, pick one from the library, or use an existing site path.",
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
    description: "Upload or swap the main hero image.",
    editor: {
      type: "asset",
      urlKey: "heroImageUrl",
      altKey: "heroImageAlt",
      assetTitle: "Hero image",
      helper:
        "Drop a new hero image here or choose one from the shared library.",
    },
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
      helper:
        "This image supports the story section and can be reused elsewhere later.",
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
  (
    <svg
      key="feature-icon-clock"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-brown fill-none"
      strokeWidth={1.5}
    >
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  (
    <svg
      key="feature-icon-home"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-brown fill-none"
      strokeWidth={1.5}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  (
    <svg
      key="feature-icon-heart"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-brown fill-none"
      strokeWidth={1.5}
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
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
}: {
  fieldId: EditableFieldId;
  selectedField: EditableFieldId;
  onSelect: (field: EditableFieldId) => void;
  label: string;
  children: ReactNode;
  className?: string;
  badgeAlign?: "left" | "right";
}) {
  const isSelected = selectedField === fieldId;

  return (
    <button
      type="button"
      onClick={() => onSelect(fieldId)}
      className={`group relative rounded-[18px] text-left focus:outline-none ${className}`}
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
      <span className="relative block">{children}</span>
    </button>
  );
}

function mergeAssets(
  currentAssets: MediaLibraryAsset[],
  uploadedAssets: MediaLibraryAsset[],
) {
  const uploadedIds = new Set(uploadedAssets.map((asset) => asset.id));

  return [
    ...uploadedAssets,
    ...currentAssets.filter((asset) => !uploadedIds.has(asset.id)),
  ];
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
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            {title}
          </p>
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
          <div className="px-4 py-3 text-xs text-text/70">
            {selectedAlt || selectedUrl}
          </div>
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
                  <p className="text-xs text-text/70">
                    {asset.altText || asset.url}
                  </p>
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

function PreviewNavbar({
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
            <span className="text-[12px] uppercase tracking-[1.5px] text-muted">
              {link.value}
            </span>
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

function PreviewHero({
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
    <section className="grid min-h-[480px] grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center bg-warm px-[3rem] py-[4rem]">
        <EditableElement
          fieldId="heroSubtitle"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero subtitle"
          className="mb-[1.2rem] w-fit"
        >
          <span className="text-[11px] uppercase tracking-[2px] text-olive">
            {draft.heroSubtitle || dictionary.hero.subtitle}
          </span>
        </EditableElement>

        <h1 className="mb-[1.5rem] font-serif text-[52px] leading-[1.1] text-dark">
          <EditableElement
            fieldId="heroTitleLine1"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 1"
            className="mb-1 w-fit"
          >
            <span>{draft.heroTitleLine1 || dictionary.hero.title.line1}</span>
          </EditableElement>
          <EditableElement
            fieldId="heroTitleLine2"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 2"
            className="mb-1 w-fit"
          >
            <em className="italic text-brown">
              {draft.heroTitleLine2 || dictionary.hero.title.line2}
            </em>
          </EditableElement>
          <EditableElement
            fieldId="heroTitleLine3"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 3"
            className="w-fit"
          >
            <span>{draft.heroTitleLine3 || dictionary.hero.title.line3}</span>
          </EditableElement>
        </h1>

        <EditableElement
          fieldId="heroDescription"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero description"
          className="mb-[2rem] max-w-[360px]"
        >
          <p className="text-[14px] leading-[1.8] text-muted">
            {draft.heroDescription || dictionary.hero.description}
          </p>
        </EditableElement>

        <div className="flex items-center gap-[1rem]">
          <EditableElement
            fieldId="heroPrimaryButtonLabel"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Primary button"
            className="w-fit"
          >
            <span className="bg-brown px-[2rem] py-[0.8rem] text-[13px] tracking-[1px] text-white">
              {draft.heroPrimaryButtonLabel || dictionary.hero.shopNow}
            </span>
          </EditableElement>
          <EditableElement
            fieldId="heroSecondaryButtonLabel"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Secondary button"
            className="w-fit"
          >
            <span className="border border-brown px-[2rem] py-[0.8rem] text-[13px] tracking-[1px] text-brown">
              {draft.heroSecondaryButtonLabel || dictionary.hero.ourStory}
            </span>
          </EditableElement>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden bg-[#D4C5B2]">
        <EditableElement
          fieldId="heroImage"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero image"
          className="block h-full w-full"
        >
          {draft.heroImageUrl ? (
            <img
              src={draft.heroImageUrl}
              alt={draft.heroImageAlt || draft.brandName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative flex h-full min-h-[320px] items-center justify-center">
              <div className="relative" style={{ width: 200, height: 120 }}>
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-brown/[0.7]"
                  style={{ top: -20, left: 0, transform: "rotate(-8deg)" }}
                />
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-[#8B7355]"
                  style={{ top: 25, left: 50 }}
                />
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-[#C5B49A]"
                  style={{ top: -5, left: 100, transform: "rotate(5deg)" }}
                />
              </div>
            </div>
          )}
        </EditableElement>

        <div className="absolute bottom-[2rem] right-[2rem] bg-cream px-[1.2rem] py-[0.8rem] text-center">
          <EditableElement
            fieldId="heroBadgeValue"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Badge value"
            badgeAlign="right"
            className="w-full"
          >
            <div className="font-serif text-[28px] text-brown">
              {draft.heroBadgeValue || dictionary.hero.badge.value}
            </div>
          </EditableElement>
          <EditableElement
            fieldId="heroBadgeLabel"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Badge label"
            badgeAlign="right"
            className="mt-1 w-full"
          >
            <div className="text-[10px] uppercase tracking-[1px] text-muted">
              {draft.heroBadgeLabel || dictionary.hero.badge.label}
            </div>
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

function PreviewStripBanner({
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

function PreviewFeaturedProducts({
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
            {draft.featuredProductsViewAllLabel ||
              dictionary.featuredProducts.viewAll}
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

function PreviewAbout({
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
        <div className="aspect-[4/3] overflow-hidden bg-[#C5B49A]">
          {draft.aboutImageUrl ? (
            <img
              src={draft.aboutImageUrl}
              alt={draft.aboutImageAlt || draft.brandName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-[18px] text-brown/60">
              Product photo here
            </div>
          )}
        </div>
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

function PreviewFeatures({
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
      title:
        draft.feature2Title || dictionary.features.items.smallBatches.title,
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
          className={`p-[2.5rem] ${
            index < items.length - 1 ? "border-r border-brown/[0.15]" : ""
          }`}
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

function PreviewCTA({
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

function PreviewFooter({
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
          &copy; {new Date().getFullYear()} {brandName}.{" "}
          {draft.footerCopyrightText}
        </p>
      </EditableElement>

      <nav className="flex gap-[1rem]">
        {socialLinks.map((link) => (
          <span
            key={link.label}
            className="text-[11px] uppercase tracking-[1px] text-muted"
          >
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
  dictionary,
  mediaLibrary,
  featuredProducts,
  supportedLocales,
}: SiteContentStudioProps) {
  const [selectedField, setSelectedField] =
    useState<EditableFieldId>("heroTitleLine1");
  const [activeWorkspacePanel, setActiveWorkspacePanel] =
    useState<WorkspacePanelId>("translations");
  const [draft, setDraft] = useState<SiteContentSettings>(settings);
  const [assets, setAssets] = useState(mediaLibrary);
  const selectedMeta = editableFields[selectedField];
  const relatedFields = Object.values(editableFields).filter(
    (field) =>
      field.section === selectedMeta.section && field.id !== selectedField,
  );
  const imageAssets = assets.filter((asset) => asset.kind === "image");
  const activeWorkspace = workspacePanelMeta[activeWorkspacePanel];

  function updateField<Key extends keyof SiteContentSettings>(
    key: Key,
    value: SiteContentSettings[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

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
            updateField(
              editor.key,
              value as SiteContentSettings[typeof editor.key],
            )
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
            updateField(
              editor.key,
              value as SiteContentSettings[typeof editor.key],
            )
          }
        />
      );
    }

    if (editor.type === "logoText") {
      return (
        <div className="grid gap-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">
              Logo mode
            </span>
            <select
              value={draft.logoMode}
              onChange={(event) =>
                updateField(
                  "logoMode",
                  event.target.value === "image" ? "image" : "text",
                )
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
            <span className="uppercase tracking-[0.16em] text-muted">
              Logo mode
            </span>
            <select
              value={draft.logoMode}
              onChange={(event) =>
                updateField(
                  "logoMode",
                  event.target.value === "image" ? "image" : "text",
                )
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
            updateField(
              editor.urlKey,
              asset.url as SiteContentSettings[typeof editor.urlKey],
            );
            updateField(
              editor.altKey,
              (asset.altText || asset.label || draft.brandName || "") as SiteContentSettings[typeof editor.altKey],
            );
          }}
          onClearSelection={() => {
            updateField(
              editor.urlKey,
              "" as SiteContentSettings[typeof editor.urlKey],
            );
            updateField(
              editor.altKey,
              "" as SiteContentSettings[typeof editor.altKey],
            );
          }}
          onAltChange={(value) =>
            updateField(
              editor.altKey,
              value as SiteContentSettings[typeof editor.altKey],
            )
          }
          onUrlChange={(value) =>
            updateField(
              editor.urlKey,
              value as SiteContentSettings[typeof editor.urlKey],
            )
          }
          onUploadedAssets={(uploadedAssets) =>
            applyUploadedAsset(uploadedAssets, editor.urlKey, editor.altKey)
          }
        />
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

    return (
      <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
        <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
          Publishing flow
        </p>
        <h3 className="mt-2 font-serif text-2xl text-dark">
          Keep the homepage edits calm and reviewable
        </h3>
        <p className="mt-3 text-sm text-text/75">
          Pick the exact field from the preview, make the change on the right,
          stage translations or locale edits only when needed, then save once.
          This keeps the content workflow predictable even as the panel grows.
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

  return (
    <form
      action={action}
      className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_430px]"
    >
      <input type="hidden" name="locale" value={locale} />
      {(
        Object.entries(draft) as Array<
          [keyof SiteContentSettings, SiteContentSettings[keyof SiteContentSettings]]
        >
      ).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value ?? ""} />
      ))}

      <section className="rounded-[32px] border border-brown/15 bg-white/80 p-5 shadow-sm backdrop-blur xl:sticky xl:top-8 xl:self-start">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              Live preview
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              Edit the homepage by clicking the exact element
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text/75">
              The preview covers the full homepage flow. Click any text, image,
              or button and the right side will jump straight to the matching
              field instead of making you hunt for it manually.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/media`}
            className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
          >
            Open media library
          </Link>
        </div>

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
            <div className="mx-auto flex max-w-[940px] flex-col gap-4">
              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewNavbar
                  locale={locale}
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewHero
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewStripBanner
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewFeaturedProducts
                  locale={locale}
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                  featuredProducts={featuredProducts}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewAbout
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewFeatures
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewCTA
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <PreviewFooter
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>
            </div>
          </div>
        </div>
      </section>
      <aside className="flex flex-col gap-6">
        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                Selected field
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">
                {selectedMeta.title}
              </h2>
              <p className="mt-2 text-sm text-text/75">
                {selectedMeta.description}
              </p>
            </div>
            <SubmitButton />
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
              <p className="text-[12px] uppercase tracking-[0.18em] text-muted">
                Nearby items
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedField(field.id)}
                    className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          {renderFieldEditor()}
        </section>

        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
            Workspace
          </p>
          <h3 className="mt-2 font-serif text-2xl text-dark">
            {activeWorkspace.title}
          </h3>
          <p className="mt-3 text-sm text-text/75">
            {activeWorkspace.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.entries(workspacePanelMeta) as Array<
              [WorkspacePanelId, (typeof workspacePanelMeta)[WorkspacePanelId]]
            >).map(([panelId, panel]) => (
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
      </aside>
    </form>
  );
}
