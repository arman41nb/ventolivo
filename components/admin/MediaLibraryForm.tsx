"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import MediaUploadDropzone from "@/components/admin/MediaUploadDropzone";
import type { MediaLibraryAsset } from "@/types";

interface MediaLibraryFormProps {
  locale: string;
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

export default function MediaLibraryForm({
  locale,
  createAction,
  updateAction,
  deleteAction,
  assets,
}: MediaLibraryFormProps) {
  const [libraryAssets, setLibraryAssets] = useState(assets);

  return (
    <div className="grid gap-6">
      <MediaUploadDropzone
        title="Image uploads"
        description="This is now the main way to add photos for products and site sections. Drop one or more images here, or open your file picker."
        multiple
        onUploaded={(uploadedAssets) =>
          setLibraryAssets((currentAssets) =>
            mergeAssets(currentAssets, uploadedAssets),
          )
        }
      />

      <section className="rounded-[28px] border border-brown/15 bg-white p-8 shadow-sm">
        <div className="mb-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            Advanced assets
          </p>
          <h2 className="mt-2 font-serif text-3xl text-dark">
            Add an external image or video only when needed
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-text/75">
            File upload is the default workflow. This form stays here for remote
            videos or third-party assets you do not want to host locally.
          </p>
        </div>
        <form action={createAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="locale" value={locale} />
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">
              Asset type
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
          <Field label="Asset URL or path" name="url" />
          <Field label="Alt text" name="altText" />
          <Field label="Thumbnail URL or path" name="thumbnailUrl" />
          <Field label="Label" name="label" />
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
            >
              Add external asset
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {libraryAssets.map((asset) => (
          <article
            key={asset.id}
            className="rounded-[24px] border border-brown/10 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 overflow-hidden rounded-[18px] bg-cream">
              <img
                src={
                  asset.kind === "video" ? asset.thumbnailUrl || asset.url : asset.url
                }
                alt={asset.altText || asset.label || asset.kind}
                className="aspect-video w-full object-cover"
              />
            </div>
            <form action={updateAction} className="grid gap-3">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={asset.id} />
              <label className="flex flex-col gap-2 text-sm">
                <span className="uppercase tracking-[0.16em] text-muted">
                  Asset type
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
              <Field label="Asset URL or path" name="url" defaultValue={asset.url} />
              <Field label="Alt text" name="altText" defaultValue={asset.altText} />
              <Field
                label="Thumbnail URL or path"
                name="thumbnailUrl"
                defaultValue={asset.thumbnailUrl}
              />
              <Field label="Label" name="label" defaultValue={asset.label} />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-olive px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                >
                  Save
                </button>
              </div>
            </form>
            <form action={deleteAction} className="mt-3">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={asset.id} />
              <button
                type="submit"
                className="rounded-full border border-red-600/30 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50"
              >
                Delete
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
