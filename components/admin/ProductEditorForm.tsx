"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import ProductTranslationAssistant from "@/components/admin/ProductTranslationAssistant";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  getSiteLocaleFlag,
  getSiteLocaleNativeLabel,
} from "@/modules/site-content/locales";
import type { MediaLibraryAsset, Product, SiteLocaleConfig } from "@/types";

interface ProductEditorFormProps {
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

export default function ProductEditorForm({
  locale,
  dictionary,
  submitLabel,
  action,
  product,
  mediaLibrary = [],
  supportedLocales,
  disabled = false,
}: ProductEditorFormProps) {
  const editorDictionary = dictionary.admin.productEditor;
  const selectedCoverId = product?.media?.find((item) => item.role === "cover")?.assetId;
  const selectedGalleryIds = new Set(
    product?.media
      ?.filter((item) => item.role === "gallery")
      .map((item) => item.assetId)
      .filter(Boolean) ?? [],
  );
  const selectedVideoId = product?.media?.find((item) => item.type === "video")?.assetId;
  const imageAssets = mediaLibrary.filter((asset) => asset.kind === "image");
  const videoAssets = mediaLibrary.filter((asset) => asset.kind === "video");
  const defaultTranslationLocale =
    supportedLocales.find((entry) => entry.code !== locale)?.code ??
    supportedLocales[0]?.code ??
    locale;
  const [activeWorkspaceTab, setActiveWorkspaceTab] =
    useState<ProductWorkspaceTab>(
      imageAssets.length > 0 || videoAssets.length > 0 ? "library" : "manual",
    );
  const [activeTranslationLocale, setActiveTranslationLocale] =
    useState(defaultTranslationLocale);
  const populatedTranslationCount = useMemo(
    () =>
      supportedLocales.filter((translationLocale) =>
        ["name", "tag", "description"].some((field) => {
          const translationMap = product?.translations?.[
            field as keyof NonNullable<Product["translations"]>
          ] as Record<string, string> | undefined;
          return Boolean(translationMap?.[translationLocale.code]?.trim());
        }),
      ).length,
    [product, supportedLocales],
  );

  return (
    <form action={action} className="rounded-[28px] border border-brown/15 bg-white p-8 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.name}
          </span>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.slug}
          </span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.tag}
          </span>
          <input
            name="tag"
            defaultValue={product?.tag ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.price}
          </span>
          <input
            name="price"
            type="number"
            min="0"
            defaultValue={product?.price ?? 0}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.color}
          </span>
          <input
            name="color"
            defaultValue={product?.color ?? "#7C8C5E"}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.weight}
          </span>
          <input
            name="weight"
            defaultValue={product?.weight ?? ""}
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.ingredients}
        </span>
        <input
          name="ingredients"
          defaultValue={product?.ingredients?.join(", ") ?? ""}
          placeholder={dictionary.admin.form.ingredientsPlaceholder}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.description}
        </span>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          required
          rows={4}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>

      <section className="mt-6 rounded-[24px] border border-brown/10 bg-cream/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {editorDictionary.workspaceBadge}
            </p>
            <h2 className="mt-2 font-serif text-2xl text-dark">
              {editorDictionary.workspaceTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-text/75">
              {editorDictionary.workspaceDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {imageAssets.length} {editorDictionary.libraryImages}
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {videoAssets.length} {editorDictionary.libraryVideos}
            </span>
            <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
              {supportedLocales.length} {editorDictionary.activeLocales}
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

        <div className="mt-5 space-y-5" hidden={activeWorkspaceTab !== "library"}>
          <div className="rounded-[20px] border border-brown/10 bg-white p-4">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
              {editorDictionary.libraryCoverTitle}
            </p>
            <p className="mt-2 text-sm text-text/75">
              {editorDictionary.libraryCoverDescription}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="rounded-[18px] border border-dashed border-brown/20 bg-cream/20 p-3 text-sm">
                <input
                  type="radio"
                  name="coverAssetId"
                  value=""
                  defaultChecked={!selectedCoverId}
                  className="mb-3"
                />
                <p className="font-medium text-dark">{editorDictionary.noLibraryCover}</p>
                <p className="mt-1 text-xs text-text/70">
                  {editorDictionary.noLibraryCoverDescription}
                </p>
              </label>
              {imageAssets.map((asset) => (
                <label
                  key={`cover-${asset.id}`}
                  className="rounded-[18px] border border-brown/10 bg-white p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="coverAssetId"
                    value={asset.id}
                    defaultChecked={selectedCoverId === asset.id}
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
                  <p className="mt-1 text-xs text-text/70">
                    {asset.altText || asset.url}
                  </p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-brown/10 bg-white p-4">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
              {editorDictionary.libraryGalleryTitle}
            </p>
            <p className="mt-2 text-sm text-text/75">
              {editorDictionary.libraryGalleryDescription}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {imageAssets.map((asset) => (
                <label
                  key={`gallery-${asset.id}`}
                  className="rounded-[18px] border border-brown/10 bg-white p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    name="galleryAssetIds"
                    value={asset.id}
                    defaultChecked={selectedGalleryIds.has(asset.id)}
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
                  <p className="mt-1 text-xs text-text/70">
                    {asset.altText || asset.url}
                  </p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-brown/10 bg-white p-4">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
              {editorDictionary.libraryVideoTitle}
            </p>
            <p className="mt-2 text-sm text-text/75">
              {editorDictionary.libraryVideoDescription}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="rounded-[18px] border border-dashed border-brown/20 bg-cream/20 p-3 text-sm">
                <input
                  type="radio"
                  name="videoAssetId"
                  value=""
                  defaultChecked={!selectedVideoId}
                  className="mb-3"
                />
                <p className="font-medium text-dark">{editorDictionary.noLibraryVideo}</p>
                <p className="mt-1 text-xs text-text/70">
                  {editorDictionary.noLibraryVideoDescription}
                </p>
              </label>
              {videoAssets.map((asset) => (
                <label
                  key={`video-${asset.id}`}
                  className="rounded-[18px] border border-brown/10 bg-white p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="videoAssetId"
                    value={asset.id}
                    defaultChecked={selectedVideoId === asset.id}
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
                  <p className="mt-1 text-xs text-text/70">
                    {asset.altText || asset.url}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-5 rounded-[20px] border border-brown/10 bg-white p-4"
          hidden={activeWorkspaceTab !== "manual"}
        >
          <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {editorDictionary.manualMediaTitle}
          </p>
          <p className="mt-2 text-sm text-text/75">
            {editorDictionary.manualMediaDescription}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {editorDictionary.coverImageUrl}
              </span>
              <input
                name="coverImageUrl"
                type="url"
                defaultValue={product?.media?.find((item) => item.role === "cover")?.url ?? ""}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {editorDictionary.coverImageAlt}
              </span>
              <input
                name="coverImageAlt"
                defaultValue={product?.media?.find((item) => item.role === "cover")?.alt ?? ""}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {editorDictionary.videoUrl}
              </span>
              <input
                name="videoUrl"
                type="url"
                defaultValue={product?.media?.find((item) => item.type === "video")?.url ?? ""}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {editorDictionary.videoThumbnailUrl}
              </span>
              <input
                name="videoThumbnailUrl"
                type="url"
                defaultValue={
                  product?.media?.find((item) => item.type === "video")?.thumbnailUrl ?? ""
                }
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">
              {editorDictionary.galleryImages}
            </span>
            <textarea
              name="galleryImages"
              rows={4}
              defaultValue={
                product?.media
                  ?.filter((item) => item.role === "gallery")
                  .map((item) => `${item.url}${item.alt ? ` | ${item.alt}` : ""}`)
                  .join("\n") ?? ""
              }
              placeholder={editorDictionary.galleryImagesPlaceholder}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
        </div>

        <div
          className="mt-5 rounded-[20px] border border-brown/10 bg-white p-4"
          hidden={activeWorkspaceTab !== "translations"}
        >
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
              <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                {supportedLocales.length} {editorDictionary.localeEditors}
              </span>
              <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
                {populatedTranslationCount} {editorDictionary.localesWithSavedData}
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
              const translationName =
                product?.translations?.name?.[translationLocale.code] ?? "";
              const translationTag =
                product?.translations?.tag?.[translationLocale.code] ?? "";
              const translationDescription =
                product?.translations?.description?.[translationLocale.code] ?? "";
              const note = [
                getSiteLocaleNativeLabel(translationLocale.code),
                translationName || translationTag || translationDescription
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
                  className="rounded-[20px] border border-brown/10 bg-cream/20 p-4"
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
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-muted">{dictionary.admin.form.name}</span>
                      <input
                        name={`translations.name.${translationLocale.code}`}
                        defaultValue={product?.translations?.name?.[translationLocale.code] ?? ""}
                        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-muted">{dictionary.admin.form.tag}</span>
                      <input
                        name={`translations.tag.${translationLocale.code}`}
                        defaultValue={product?.translations?.tag?.[translationLocale.code] ?? ""}
                        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                      />
                    </label>
                  </div>
                  <label className="mt-4 flex flex-col gap-2 text-sm">
                    <span className="text-muted">{dictionary.admin.form.description}</span>
                    <textarea
                      name={`translations.description.${translationLocale.code}`}
                      defaultValue={
                        product?.translations?.description?.[translationLocale.code] ?? ""
                      }
                      rows={4}
                      className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <label className="mt-4 inline-flex items-center gap-3 text-sm text-dark">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured ?? false}
          className="h-4 w-4 accent-brown"
        />
        {dictionary.admin.form.featured}
      </label>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-olive px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
