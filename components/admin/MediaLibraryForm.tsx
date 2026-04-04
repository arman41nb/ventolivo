"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import MediaUploadDropzone from "@/components/admin/MediaUploadDropzone";
import type { MediaLibraryAsset } from "@/types";

interface MediaLibraryFormProps {
  locale: string;
  dictionary: Dictionary["admin"]["mediaManager"];
  createAction: (formData: FormData) => void | Promise<void>;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  assets: MediaLibraryAsset[];
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
      />
    </label>
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

function getAssetPreviewUrl(asset: MediaLibraryAsset) {
  return asset.kind === "video" ? asset.thumbnailUrl || asset.url : asset.url;
}

function matchesAssetSearch(asset: MediaLibraryAsset, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    asset.label,
    asset.altText,
    asset.url,
    asset.thumbnailUrl,
    asset.kind,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

function FilterButton({
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

export default function MediaLibraryForm({
  locale,
  dictionary,
  createAction,
  updateAction,
  deleteAction,
  assets,
}: MediaLibraryFormProps) {
  const [libraryAssets, setLibraryAssets] = useState(assets);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">(
    "all",
  );
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(
    assets[0]?.id ?? null,
  );
  const [showExternalComposer, setShowExternalComposer] = useState(false);
  const visibleAssets = useMemo(
    () =>
      libraryAssets.filter(
        (asset) =>
          (kindFilter === "all" || asset.kind === kindFilter) &&
          matchesAssetSearch(asset, searchQuery),
      ),
    [kindFilter, libraryAssets, searchQuery],
  );
  const imageCount = libraryAssets.filter((asset) => asset.kind === "image").length;
  const videoCount = libraryAssets.filter((asset) => asset.kind === "video").length;

  return (
    <div className="grid gap-6">
      <MediaUploadDropzone
        title={dictionary.uploadTitle}
        description={dictionary.uploadDescription}
        multiple
        onUploaded={(uploadedAssets) => {
          setLibraryAssets((currentAssets) =>
            mergeAssets(currentAssets, uploadedAssets),
          );
          setExpandedAssetId(uploadedAssets[0]?.id ?? null);
        }}
      />

      <section className="rounded-[28px] border border-brown/15 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {dictionary.controlsBadge}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              {dictionary.controlsTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-text/75">
              {dictionary.controlsDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {libraryAssets.length} {dictionary.totalAssets}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {imageCount} {dictionary.images}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {videoCount} {dictionary.videos}
            </span>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">
              {dictionary.searchAssets}
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={dictionary.searchPlaceholder}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <div className="flex items-end gap-2">
            <FilterButton
              active={kindFilter === "all"}
              label={dictionary.all}
              onClick={() => setKindFilter("all")}
            />
            <FilterButton
              active={kindFilter === "image"}
              label={dictionary.images}
              onClick={() => setKindFilter("image")}
            />
            <FilterButton
              active={kindFilter === "video"}
              label={dictionary.videos}
              onClick={() => setKindFilter("video")}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowExternalComposer((current) => !current)}
            className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
          >
            {showExternalComposer
              ? dictionary.hideExternalAssetForm
              : dictionary.addExternalAsset}
          </button>
        </div>

        <div hidden={!showExternalComposer}>
          <form action={createAction} className="mt-5 grid gap-4 rounded-[24px] border border-brown/10 bg-cream/25 p-5 md:grid-cols-2">
            <input type="hidden" name="locale" value={locale} />
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {dictionary.assetType}
              </span>
              <select
                name="kind"
                defaultValue="video"
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <Field label={dictionary.assetUrl} name="url" />
            <Field label={dictionary.altText} name="altText" />
            <Field label={dictionary.thumbnailUrl} name="thumbnailUrl" />
            <Field label={dictionary.label} name="label" />
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
              >
                {dictionary.saveExternalAsset}
              </button>
            </div>
          </form>
        </div>
      </section>

      {visibleAssets.length > 0 ? (
        <section className="grid gap-4">
          {visibleAssets.map((asset) => {
            const isExpanded = expandedAssetId === asset.id;

            return (
              <article
                key={asset.id}
                className="rounded-[24px] border border-brown/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="w-full max-w-[220px] overflow-hidden rounded-[18px] bg-cream">
                      <img
                        src={getAssetPreviewUrl(asset)}
                        alt={asset.altText || asset.label || asset.kind}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-cream px-3 py-1 text-xs uppercase tracking-[0.14em] text-brown">
                          {asset.kind}
                        </span>
                        <span className="rounded-full bg-cream px-3 py-1 text-xs uppercase tracking-[0.14em] text-brown">
                          {asset.id}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl text-dark">
                        {asset.label || dictionary.untitledAsset}
                      </h3>
                      <p className="text-sm text-text/75">{asset.url}</p>
                      <p className="text-sm text-text/70">
                        {asset.altText || dictionary.noAltText}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedAssetId((current) =>
                          current === asset.id ? null : asset.id,
                        )
                      }
                      className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                    >
                      {isExpanded ? dictionary.collapseEditor : dictionary.editDetails}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="mt-5 border-t border-brown/10 pt-5">
                    <form action={updateAction} className="grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="id" value={asset.id} />
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="uppercase tracking-[0.16em] text-muted">
                          {dictionary.assetType}
                        </span>
                        <select
                          name="kind"
                          defaultValue={asset.kind}
                          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </label>
                      <Field label={dictionary.assetUrl} name="url" defaultValue={asset.url} />
                      <Field label={dictionary.altText} name="altText" defaultValue={asset.altText} />
                      <Field
                        label={dictionary.thumbnailUrl}
                        name="thumbnailUrl"
                        defaultValue={asset.thumbnailUrl}
                      />
                      <Field label={dictionary.label} name="label" defaultValue={asset.label} />
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="rounded-full bg-olive px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                        >
                          {dictionary.saveAsset}
                        </button>
                      </div>
                    </form>

                    <form action={deleteAction} className="mt-4">
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="id" value={asset.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-600/30 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50"
                      >
                        {dictionary.deleteAsset}
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-[24px] border border-dashed border-brown/20 bg-white px-6 py-8 text-sm text-text/70">
          {dictionary.noMatchingAssets}
        </section>
      )}
    </div>
  );
}
