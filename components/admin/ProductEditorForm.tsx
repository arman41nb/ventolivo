/* eslint-disable @next/next/no-img-element */
import ProductTranslationAssistant from "@/components/admin/ProductTranslationAssistant";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
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

      <div className="mt-6 rounded-[24px] border border-brown/10 bg-cream/30 p-5">
        <div className="mb-4">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            Visual content
          </p>
          <p className="mt-2 text-sm text-text/75">
            Mix reusable media-library assets with direct URLs for product-specific visuals.
          </p>
        </div>
        {imageAssets.length > 0 ? (
          <div className="mb-5">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">Library cover image</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="rounded-[18px] border border-dashed border-brown/20 bg-white p-3 text-sm">
                <input
                  type="radio"
                  name="coverAssetId"
                  value=""
                  defaultChecked={!selectedCoverId}
                  className="mb-3"
                />
                <p className="text-xs text-text/70">Use custom URL or no cover asset</p>
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
                  <p className="mt-2 text-xs text-text/70">{asset.label || asset.url}</p>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        {imageAssets.length > 0 ? (
          <div className="mb-5">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">Library gallery images</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
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
                  <p className="mt-2 text-xs text-text/70">{asset.label || asset.url}</p>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        {videoAssets.length > 0 ? (
          <div className="mb-5">
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">Library product video</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="rounded-[18px] border border-dashed border-brown/20 bg-white p-3 text-sm">
                <input
                  type="radio"
                  name="videoAssetId"
                  value=""
                  defaultChecked={!selectedVideoId}
                  className="mb-3"
                />
                <p className="text-xs text-text/70">Use custom URL or no video asset</p>
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
                  <p className="mt-2 text-xs text-text/70">{asset.label || asset.url}</p>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Cover image URL</span>
            <input
              name="coverImageUrl"
              type="url"
              defaultValue={product?.media?.find((item) => item.role === "cover")?.url ?? ""}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Cover image alt</span>
            <input
              name="coverImageAlt"
              defaultValue={product?.media?.find((item) => item.role === "cover")?.alt ?? ""}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Video URL</span>
            <input
              name="videoUrl"
              type="url"
              defaultValue={product?.media?.find((item) => item.type === "video")?.url ?? ""}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Video thumbnail URL</span>
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
            Gallery images
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
            placeholder="https://... | Alt text"
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[24px] border border-brown/10 bg-cream/30 p-5">
        <div className="flex flex-col gap-4">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            {dictionary.admin.inventory.translationsTitle}
          </p>
          <ProductTranslationAssistant
            currentLocale={locale}
            locales={supportedLocales}
            dictionary={dictionary.admin.translationAssistant}
          />
        </div>
        <div className="mt-4 grid gap-5">
          {supportedLocales.map((translationLocale) => (
            <div
              key={translationLocale.code}
              className="rounded-[20px] border border-brown/10 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brown">
                {translationLocale.label}
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
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
                  rows={3}
                  className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

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
