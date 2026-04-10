"use client";

/* eslint-disable @next/next/no-img-element */
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import ProductTranslationAssistant from "@/components/admin/ProductTranslationAssistant";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getSiteLocaleFlag, getSiteLocaleNativeLabel } from "@/modules/site-content";
import type { MediaLibraryAsset, Product, SiteLocaleConfig } from "@/types";

interface ProductEditorWorkspaceProps {
  locale: Locale;
  dictionary: Dictionary;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  mediaLibrary?: MediaLibraryAsset[];
  supportedLocales: SiteLocaleConfig[];
  disabled?: boolean;
}

type ProductWorkspaceTab = "library" | "manual" | "translations";

function SectionTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
        active
          ? "border-brown bg-brown text-white"
          : "border-brown/20 bg-white text-brown hover:bg-brown/5"
      }`}
    >
      {label}
    </button>
  );
}

function LocaleEditorChip({
  active,
  localeCode,
  label,
  note,
  onClick,
}: {
  active: boolean;
  localeCode: string;
  label: string;
  note: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] border px-4 py-3 text-left transition-colors ${
        active
          ? "border-brown bg-white shadow-sm"
          : "border-brown/15 bg-white/70 hover:border-brown/30 hover:bg-white"
      }`}
    >
      <p className="text-sm font-medium text-dark">
        {getSiteLocaleFlag(localeCode)} {label}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
        {localeCode.toUpperCase()}
      </p>
      <p className="mt-1 text-sm text-text/70">{note}</p>
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-text/55">{hint}</span> : null}
    </label>
  );
}

function getTextValue(value: string | undefined) {
  return value?.trim() ?? "";
}

function getAssetById(assets: MediaLibraryAsset[], assetId: string) {
  return assets.find((asset) => asset.id === assetId);
}

export default function ProductEditorWorkspace({
  locale,
  dictionary,
  submitLabel,
  action,
  product,
  mediaLibrary = [],
  supportedLocales,
  disabled = false,
}: ProductEditorWorkspaceProps) {
  const editorDictionary = dictionary.admin.productEditor;
  const selectedProductCover = product?.media?.find((item) => item.role === "cover");
  const selectedProductVideo = product?.media?.find((item) => item.type === "video");
  const imageAssets = mediaLibrary.filter((asset) => asset.kind === "image");
  const videoAssets = mediaLibrary.filter((asset) => asset.kind === "video");
  const defaultTranslationLocale =
    supportedLocales.find((entry) => entry.code !== locale)?.code ??
    supportedLocales[0]?.code ??
    locale;

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<ProductWorkspaceTab>(
    imageAssets.length > 0 || videoAssets.length > 0 ? "library" : "manual",
  );
  const [activeTranslationLocale, setActiveTranslationLocale] = useState(defaultTranslationLocale);
  const [assetSearch, setAssetSearch] = useState("");
  const deferredAssetSearch = useDeferredValue(assetSearch);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [tag, setTag] = useState(product?.tag ?? "");
  const [price, setPrice] = useState(String(product?.price ?? 0));
  const [color, setColor] = useState(product?.color ?? "#7C8C5E");
  const [weight, setWeight] = useState(product?.weight ?? "");
  const [ingredients, setIngredients] = useState(product?.ingredients?.join(", ") ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [coverAssetId, setCoverAssetId] = useState(selectedProductCover?.assetId ?? "");
  const [galleryAssetIds, setGalleryAssetIds] = useState<string[]>(
    product?.media
      ?.filter((item) => item.role === "gallery" && item.assetId)
      .map((item) => item.assetId as string) ?? [],
  );
  const [videoAssetId, setVideoAssetId] = useState(selectedProductVideo?.assetId ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(selectedProductCover?.url ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(selectedProductCover?.alt ?? "");
  const [videoUrl, setVideoUrl] = useState(selectedProductVideo?.url ?? "");
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(
    selectedProductVideo?.thumbnailUrl ?? "",
  );
  const [galleryImages, setGalleryImages] = useState(
    product?.media
      ?.filter((item) => item.role === "gallery" && !item.assetId)
      .map((item) => `${item.url}${item.alt ? ` | ${item.alt}` : ""}`)
      .join("\n") ?? "",
  );

  const normalizedAssetSearch = deferredAssetSearch.trim().toLowerCase();
  const visibleImageAssets = useMemo(
    () =>
      imageAssets.filter((asset) =>
        !normalizedAssetSearch
          ? true
          : [asset.label, asset.altText, asset.url]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(normalizedAssetSearch),
      ),
    [imageAssets, normalizedAssetSearch],
  );
  const visibleVideoAssets = useMemo(
    () =>
      videoAssets.filter((asset) =>
        !normalizedAssetSearch
          ? true
          : [asset.label, asset.altText, asset.url, asset.thumbnailUrl]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(normalizedAssetSearch),
      ),
    [normalizedAssetSearch, videoAssets],
  );

  const selectedCoverAsset = coverAssetId ? getAssetById(imageAssets, coverAssetId) : undefined;
  const selectedVideoAsset = videoAssetId ? getAssetById(videoAssets, videoAssetId) : undefined;
  const previewCoverUrl = selectedCoverAsset?.url || coverImageUrl;
  const previewCoverAlt =
    selectedCoverAsset?.altText ||
    selectedCoverAsset?.label ||
    coverImageAlt ||
    name ||
    "product cover";
  const previewGalleryCount =
    galleryAssetIds.length + galleryImages.split(/\r?\n/).filter(Boolean).length;
  const translationCoverage = useMemo(
    () =>
      supportedLocales.filter((translationLocale) =>
        ["name", "tag", "description", "weight", "ingredients"].some((field) => {
          const translationMap = product?.translations?.[
            field as keyof NonNullable<Product["translations"]>
          ] as Record<string, string | string[]> | undefined;
          const value = translationMap?.[translationLocale.code];

          return Array.isArray(value)
            ? value.some((item) => item.trim().length > 0)
            : Boolean(value?.trim());
        }),
      ).length,
    [product, supportedLocales],
  );
  const missingCoreFields = [
    getTextValue(name) ? null : dictionary.admin.form.name,
    getTextValue(slug) ? null : dictionary.admin.form.slug,
    getTextValue(tag) ? null : dictionary.admin.form.tag,
    Number(price) >= 0 ? null : dictionary.admin.form.price,
    getTextValue(description) ? null : dictionary.admin.form.description,
    previewCoverUrl ? null : "Cover media",
  ].filter(Boolean);
  const pricePreview =
    Number(price) > 0 ? new Intl.NumberFormat(locale).format(Number(price)) : "0";

  function handleGalleryToggle(assetId: string) {
    setGalleryAssetIds((currentIds) =>
      currentIds.includes(assetId)
        ? currentIds.filter((currentId) => currentId !== assetId)
        : [...currentIds, assetId],
    );
  }

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
      <input type="hidden" name="locale" value={locale} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <section className="grid gap-6">
        <section className="rounded-[32px] border border-brown/15 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.22em] text-muted">
                Product architecture
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">Catalog essentials</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-text/75">
                Keep the inputs clean and predictable. This section controls the product identity
                that will be reused across the storefront, admin list, and API responses.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                /products/{slug || "new-product"}
              </span>
              <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                {supportedLocales.length} locales
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              label={dictionary.admin.form.name}
              hint="The storefront card and admin title use this value."
            >
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
            <Field
              label={dictionary.admin.form.slug}
              hint="Lowercase letters, numbers, and hyphens only."
            >
              <input
                name="slug"
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                required
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
            <Field label={dictionary.admin.form.tag}>
              <input
                name="tag"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                required
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
            <Field label={dictionary.admin.form.price} hint="Stored as an integer price in TL.">
              <input
                name="price"
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
            <Field
              label={dictionary.admin.form.color}
              hint="Used in previews and merchandising accents."
            >
              <div className="flex items-center gap-3 rounded-[18px] border border-brown/20 bg-white px-4 py-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-12 rounded border-0 bg-transparent p-0"
                />
                <input
                  name="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label={dictionary.admin.form.weight}>
              <input
                name="weight"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4">
            <Field
              label={dictionary.admin.form.ingredients}
              hint="Comma-separated values work best for future reuse."
            >
              <input
                name="ingredients"
                value={ingredients}
                onChange={(event) => setIngredients(event.target.value)}
                placeholder={dictionary.admin.form.ingredientsPlaceholder}
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
            <Field label={dictionary.admin.form.description}>
              <textarea
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-3 rounded-full border border-brown/15 bg-cream/35 px-4 py-3 text-sm text-dark">
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 accent-brown"
              />
              {dictionary.admin.form.featured}
            </label>
            <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
              TL {pricePreview}
            </span>
          </div>
        </section>

        <section className="rounded-[32px] border border-brown/15 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.22em] text-muted">
                {editorDictionary.workspaceBadge}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">
                {editorDictionary.workspaceTitle}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-text/75">
                Pick reusable assets from the library when possible, or switch to manual mode when
                you need to paste direct URLs from a CDN or another source.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                {imageAssets.length} {editorDictionary.libraryImages}
              </span>
              <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                {videoAssets.length} {editorDictionary.libraryVideos}
              </span>
              <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
                {previewGalleryCount} gallery items
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <SectionTabButton
              active={activeWorkspaceTab === "library"}
              label={editorDictionary.tabs.library}
              onClick={() => setActiveWorkspaceTab("library")}
            />
            <SectionTabButton
              active={activeWorkspaceTab === "manual"}
              label={editorDictionary.tabs.manual}
              onClick={() => setActiveWorkspaceTab("manual")}
            />
            <SectionTabButton
              active={activeWorkspaceTab === "translations"}
              label={editorDictionary.tabs.translations}
              onClick={() => setActiveWorkspaceTab("translations")}
            />
          </div>

          {activeWorkspaceTab === "library" ? (
            <div className="mt-5 space-y-5">
              <Field
                label="Asset search"
                hint="Search once and reuse the same filtered library for cover, gallery, and video."
              >
                <input
                  value={assetSearch}
                  onChange={(event) => setAssetSearch(event.target.value)}
                  placeholder="Search by label, alt text, or URL"
                  className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </Field>

              <div className="rounded-[24px] border border-brown/10 bg-cream/25 p-5">
                <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {editorDictionary.libraryCoverTitle}
                </p>
                <p className="mt-2 text-sm text-text/75">
                  {editorDictionary.libraryCoverDescription}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="rounded-[18px] border border-dashed border-brown/20 bg-white p-4 text-sm">
                    <input
                      type="radio"
                      name="coverAssetId"
                      value=""
                      checked={!coverAssetId}
                      onChange={() => setCoverAssetId("")}
                      className="mb-3"
                    />
                    <p className="font-medium text-dark">{editorDictionary.noLibraryCover}</p>
                    <p className="mt-1 text-xs text-text/70">
                      {editorDictionary.noLibraryCoverDescription}
                    </p>
                  </label>
                  {visibleImageAssets.map((asset) => (
                    <label
                      key={`cover-${asset.id}`}
                      className={`rounded-[18px] border p-3 text-sm transition-colors ${
                        coverAssetId === asset.id
                          ? "border-brown bg-white shadow-sm"
                          : "border-brown/10 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="coverAssetId"
                        value={asset.id}
                        checked={coverAssetId === asset.id}
                        onChange={() => {
                          setCoverAssetId(asset.id);
                          setCoverImageUrl("");
                          setCoverImageAlt(asset.altText ?? asset.label ?? "");
                        }}
                        className="mb-3"
                      />
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.label || "cover asset"}
                        className="aspect-video w-full rounded-[12px] object-cover"
                      />
                      <p className="mt-2 text-xs font-medium text-dark">
                        {asset.label || "Untitled asset"}
                      </p>
                      <p className="mt-1 text-xs text-text/70">{asset.altText || asset.url}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-brown/10 bg-cream/25 p-5">
                <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {editorDictionary.libraryGalleryTitle}
                </p>
                <p className="mt-2 text-sm text-text/75">
                  {editorDictionary.libraryGalleryDescription}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {visibleImageAssets.map((asset) => (
                    <label
                      key={`gallery-${asset.id}`}
                      className={`rounded-[18px] border p-3 text-sm transition-colors ${
                        galleryAssetIds.includes(asset.id)
                          ? "border-brown bg-white shadow-sm"
                          : "border-brown/10 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="galleryAssetIds"
                        value={asset.id}
                        checked={galleryAssetIds.includes(asset.id)}
                        onChange={() => handleGalleryToggle(asset.id)}
                        className="mb-3"
                      />
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.label || "gallery asset"}
                        className="aspect-video w-full rounded-[12px] object-cover"
                      />
                      <p className="mt-2 text-xs font-medium text-dark">
                        {asset.label || "Untitled asset"}
                      </p>
                      <p className="mt-1 text-xs text-text/70">{asset.altText || asset.url}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-brown/10 bg-cream/25 p-5">
                <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {editorDictionary.libraryVideoTitle}
                </p>
                <p className="mt-2 text-sm text-text/75">
                  {editorDictionary.libraryVideoDescription}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="rounded-[18px] border border-dashed border-brown/20 bg-white p-4 text-sm">
                    <input
                      type="radio"
                      name="videoAssetId"
                      value=""
                      checked={!videoAssetId}
                      onChange={() => setVideoAssetId("")}
                      className="mb-3"
                    />
                    <p className="font-medium text-dark">{editorDictionary.noLibraryVideo}</p>
                    <p className="mt-1 text-xs text-text/70">
                      {editorDictionary.noLibraryVideoDescription}
                    </p>
                  </label>
                  {visibleVideoAssets.map((asset) => (
                    <label
                      key={`video-${asset.id}`}
                      className={`rounded-[18px] border p-3 text-sm transition-colors ${
                        videoAssetId === asset.id
                          ? "border-brown bg-white shadow-sm"
                          : "border-brown/10 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="videoAssetId"
                        value={asset.id}
                        checked={videoAssetId === asset.id}
                        onChange={() => {
                          setVideoAssetId(asset.id);
                          setVideoUrl("");
                          setVideoThumbnailUrl(asset.thumbnailUrl ?? "");
                        }}
                        className="mb-3"
                      />
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.altText || asset.label || "video asset"}
                        className="aspect-video w-full rounded-[12px] object-cover"
                      />
                      <p className="mt-2 text-xs font-medium text-dark">
                        {asset.label || "Untitled video"}
                      </p>
                      <p className="mt-1 text-xs text-text/70">{asset.altText || asset.url}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeWorkspaceTab === "manual" ? (
            <div className="mt-5 rounded-[24px] border border-brown/10 bg-cream/25 p-5">
              <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                {editorDictionary.manualMediaTitle}
              </p>
              <p className="mt-2 text-sm text-text/75">{editorDictionary.manualMediaDescription}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label={editorDictionary.coverImageUrl}>
                  <input
                    name="coverImageUrl"
                    type="url"
                    value={coverImageUrl}
                    onChange={(event) => {
                      setCoverImageUrl(event.target.value);
                      setCoverAssetId("");
                    }}
                    className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </Field>
                <Field label={editorDictionary.coverImageAlt}>
                  <input
                    name="coverImageAlt"
                    value={coverImageAlt}
                    onChange={(event) => setCoverImageAlt(event.target.value)}
                    className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </Field>
                <Field label={editorDictionary.videoUrl}>
                  <input
                    name="videoUrl"
                    type="url"
                    value={videoUrl}
                    onChange={(event) => {
                      setVideoUrl(event.target.value);
                      setVideoAssetId("");
                    }}
                    className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </Field>
                <Field label={editorDictionary.videoThumbnailUrl}>
                  <input
                    name="videoThumbnailUrl"
                    type="url"
                    value={videoThumbnailUrl}
                    onChange={(event) => setVideoThumbnailUrl(event.target.value)}
                    className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field
                  label={editorDictionary.galleryImages}
                  hint="Use one line per image. Optional alt text can be added as URL | Alt text."
                >
                  <textarea
                    name="galleryImages"
                    rows={5}
                    value={galleryImages}
                    onChange={(event) => setGalleryImages(event.target.value)}
                    placeholder={editorDictionary.galleryImagesPlaceholder}
                    className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {activeWorkspaceTab === "translations" ? (
            <div className="mt-5 rounded-[24px] border border-brown/10 bg-cream/25 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                    {dictionary.admin.inventory.translationsTitle}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-dark">
                    {editorDictionary.translationsTitle}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-text/75">
                    {editorDictionary.translationsDescription}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                    {supportedLocales.length} {editorDictionary.localeEditors}
                  </span>
                  <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
                    {translationCoverage} {editorDictionary.localesWithSavedData}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <ProductTranslationAssistant
                  currentLocale={locale}
                  locales={supportedLocales}
                  dictionary={dictionary.admin.translationAssistant}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {supportedLocales.map((translationLocale) => {
                  const translationName = product?.translations?.name?.[translationLocale.code] ?? "";
                  const translationTag = product?.translations?.tag?.[translationLocale.code] ?? "";
                  const translationDescription =
                    product?.translations?.description?.[translationLocale.code] ?? "";
                  const translationWeight = product?.translations?.weight?.[translationLocale.code] ?? "";
                  const translationIngredients =
                    product?.translations?.ingredients?.[translationLocale.code]?.join(", ") ?? "";
                  const note = [
                    getSiteLocaleNativeLabel(translationLocale.code),
                    translationName ||
                    translationTag ||
                    translationDescription ||
                    translationWeight ||
                    translationIngredients
                      ? editorDictionary.hasContent
                      : editorDictionary.empty,
                  ].join(" / ");

                  return (
                    <LocaleEditorChip
                      key={translationLocale.code}
                      active={activeTranslationLocale === translationLocale.code}
                      localeCode={translationLocale.code}
                      label={translationLocale.label}
                      note={note}
                      onClick={() => setActiveTranslationLocale(translationLocale.code)}
                    />
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4">
                {supportedLocales.map((translationLocale) => {
                  const isActive = activeTranslationLocale === translationLocale.code;
                  const isCurrentLocale = translationLocale.code === locale;

                  return (
                    <section
                      key={translationLocale.code}
                      hidden={!isActive}
                      className="rounded-[20px] border border-brown/10 bg-white p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-dark">
                            {getSiteLocaleFlag(translationLocale.code)} {translationLocale.label}
                          </p>
                          <p className="mt-1 text-sm text-text/70">
                            {getSiteLocaleNativeLabel(translationLocale.code)} /{" "}
                            {translationLocale.code.toUpperCase()}
                          </p>
                        </div>
                        {isCurrentLocale ? (
                          <span className="rounded-full bg-brown px-3 py-1 text-xs uppercase tracking-[0.16em] text-white">
                            {editorDictionary.currentEditorLocale}
                          </span>
                        ) : null}
                      </div>

                      {isCurrentLocale ? (
                        <p className="mt-3 text-sm text-text/75">
                          {editorDictionary.currentEditorLocaleDescription}
                        </p>
                      ) : null}

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field label={dictionary.admin.form.name}>
                          <input
                            name={`translations.name.${translationLocale.code}`}
                            defaultValue={product?.translations?.name?.[translationLocale.code] ?? ""}
                            className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                          />
                        </Field>
                        <Field label={dictionary.admin.form.tag}>
                          <input
                            name={`translations.tag.${translationLocale.code}`}
                            defaultValue={product?.translations?.tag?.[translationLocale.code] ?? ""}
                            className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                          />
                        </Field>
                        <Field label={dictionary.admin.form.weight}>
                          <input
                            name={`translations.weight.${translationLocale.code}`}
                            defaultValue={product?.translations?.weight?.[translationLocale.code] ?? ""}
                            className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                          />
                        </Field>
                        <Field label={dictionary.admin.form.ingredients}>
                          <input
                            name={`translations.ingredients.${translationLocale.code}`}
                            defaultValue={product?.translations?.ingredients?.[translationLocale.code]?.join(", ") ?? ""}
                            placeholder={dictionary.admin.form.ingredientsPlaceholder}
                            className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                          />
                        </Field>
                      </div>
                      <div className="mt-4">
                        <Field label={dictionary.admin.form.description}>
                          <textarea
                            name={`translations.description.${translationLocale.code}`}
                            defaultValue={
                              product?.translations?.description?.[translationLocale.code] ?? ""
                            }
                            rows={4}
                            className="rounded-[18px] border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                          />
                        </Field>
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      </section>

      <aside className="flex flex-col gap-6 self-start rounded-[32px] border border-brown/15 bg-[#f7f0e6]/96 p-4 shadow-[0_24px_60px_rgba(71,49,30,0.12)] backdrop-blur xl:sticky xl:top-8 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
        <section className="rounded-[28px] border border-brown/15 bg-white p-5 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.22em] text-muted">Ready to publish</p>
          <h2 className="mt-2 font-serif text-3xl text-dark">
            {product ? "Refine this product" : "Create a polished entry"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-text/75">
            The right panel gives the seller a fast confidence check before saving: catalog
            identity, cover readiness, translation depth, and merchandising preview.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {missingCoreFields.length === 0
                ? "Core fields ready"
                : `${missingCoreFields.length} attention items`}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {featured ? "Featured placement on" : "Standard product"}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={disabled}
              className="rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-6 py-3 text-sm uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(107,79,58,0.18)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-muted"
            >
              {submitLabel}
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-brown/15 bg-white p-5 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.22em] text-muted">Live product preview</p>
          <div className="mt-4 overflow-hidden rounded-[28px] border border-brown/10 bg-[linear-gradient(180deg,#fffaf5_0%,#f2e7db_100%)]">
            <div
              className="flex min-h-[220px] items-center justify-center px-6 py-8"
              style={{ background: `radial-gradient(circle at top, ${color}22, transparent 55%)` }}
            >
              {previewCoverUrl ? (
                <img
                  src={previewCoverUrl}
                  alt={previewCoverAlt}
                  className="h-44 w-44 rounded-[24px] object-cover shadow-[0_20px_45px_rgba(107,79,58,0.14)]"
                />
              ) : (
                <div className="grid h-44 w-44 place-items-center rounded-[24px] border border-dashed border-brown/20 bg-white/72 text-center text-sm text-text/60">
                  Add cover media
                </div>
              )}
            </div>
            <div className="border-t border-brown/10 bg-white px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown/75">
                  {tag || "tag"}
                </span>
                {featured ? (
                  <span className="rounded-full bg-olive/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-olive">
                    Featured
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 font-serif text-3xl text-dark">
                {name || "Untitled product"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text/74">
                {description ||
                  "The product description will appear here as the seller writes it."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-brown/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                  TL {pricePreview}
                </span>
                {weight ? (
                  <span className="rounded-full border border-brown/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                    {weight}
                  </span>
                ) : null}
                <span className="rounded-full border border-brown/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                  {previewGalleryCount} gallery
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-brown/15 bg-white p-5 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.22em] text-muted">Health check</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Catalog identity
              </p>
              <p className="mt-2 text-sm text-text/75">
                {name && slug && tag
                  ? "Name, slug, and tag are set."
                  : "Complete the core catalog identity fields."}
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Media readiness
              </p>
              <p className="mt-2 text-sm text-text/75">
                {previewCoverUrl
                  ? `Cover ready. Gallery items: ${previewGalleryCount}. Video: ${selectedVideoAsset || videoUrl ? "yes" : "no"}.`
                  : "A professional listing should have at least one cover image before publishing."}
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Translation depth
              </p>
              <p className="mt-2 text-sm text-text/75">
                {translationCoverage} of {supportedLocales.length} locales currently have saved
                translation data.
              </p>
            </div>
            {missingCoreFields.length > 0 ? (
              <div className="rounded-[20px] border border-amber-500/20 bg-amber-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-amber-900">
                  Needs attention
                </p>
                <p className="mt-2 text-sm text-amber-900">{missingCoreFields.join(", ")}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[28px] border border-brown/15 bg-white p-5 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.22em] text-muted">Selected media</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Cover source</p>
              <p className="mt-2 text-sm text-text/75">
                {selectedCoverAsset
                  ? selectedCoverAsset.label || selectedCoverAsset.url
                  : coverImageUrl || "No cover selected"}
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Video source</p>
              <p className="mt-2 text-sm text-text/75">
                {selectedVideoAsset
                  ? selectedVideoAsset.label || selectedVideoAsset.url
                  : videoUrl || "No video selected"}
              </p>
            </div>
            <div className="rounded-[20px] border border-brown/10 bg-cream/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Ingredients</p>
              <p className="mt-2 text-sm text-text/75">
                {ingredients || "Ingredient list will appear here once entered."}
              </p>
            </div>
          </div>
        </section>
      </aside>
    </form>
  );
}
