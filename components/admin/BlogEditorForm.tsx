"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { BlogPost, MediaLibraryAsset } from "@/types";
import BlogRichTextEditor from "@/components/admin/BlogRichTextEditor";

interface BlogEditorFormProps {
  locale: Locale;
  siteUrl: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  post?: BlogPost;
  mediaLibrary: MediaLibraryAsset[];
  disabled?: boolean;
}

function toDatetimeLocalValue(date: Date | undefined): string {
  if (!date) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditorForm({
  locale,
  siteUrl,
  submitLabel,
  action,
  post,
  mediaLibrary,
  disabled = false,
}: BlogEditorFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [contentHtml, setContentHtml] = useState(post?.content ?? "<p></p>");
  const canonicalUrl = useMemo(
    () => `${siteUrl}/${locale}/blog/${slug || "your-post-slug"}`,
    [locale, siteUrl, slug],
  );
  const snippetTitle = (seoTitle || title || "Post title preview").trim();
  const snippetDescription = (
    seoDescription || summary || "Meta description preview for this article."
  ).trim();

  return (
    <form action={action} className="rounded-[30px] border border-brown/15 bg-white p-7 shadow-sm md:p-8">
      <input type="hidden" name="locale" value={locale} />
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="content" value={contentHtml} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Title</span>
              <input
                name="title"
                required
                minLength={4}
                maxLength={160}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Status</span>
              <select
                name="status"
                defaultValue={post?.status ?? "draft"}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Slug</span>
              <input
                name="slug"
                required
                maxLength={160}
                pattern="^[a-z0-9-]+$"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <button
              type="button"
              onClick={() => setSlug(slugify(title))}
              className="self-end rounded-full border border-brown/15 bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              Generate slug
            </button>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Summary</span>
            <textarea
              name="summary"
              required
              minLength={20}
              maxLength={320}
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Content Editor</span>
            <BlogRichTextEditor
              initialValue={post?.content ?? "<p></p>"}
              mediaLibrary={mediaLibrary}
              onChange={setContentHtml}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Tags (comma-separated)</span>
              <input
                name="tags"
                defaultValue={post?.tags.join(", ") ?? ""}
                placeholder="soap, natural-skin-care"
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Published at</span>
              <input
                name="publishedAt"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(post?.publishedAt)}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Cover image URL or path</span>
              <input
                name="coverImage"
                defaultValue={post?.coverImage ?? ""}
                placeholder="/uploads/media/example.jpg"
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">Cover alt text</span>
              <input
                name="coverAlt"
                defaultValue={post?.coverAlt ?? ""}
                maxLength={160}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
          </div>

          <div className="rounded-[22px] border border-brown/10 bg-cream/30 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">SEO</p>
            <div className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="uppercase tracking-[0.16em] text-muted">SEO title (recommended 50-60)</span>
                <input
                  name="seoTitle"
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                  maxLength={70}
                  className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
                <span className="text-xs text-muted">{seoTitle.length}/70</span>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="uppercase tracking-[0.16em] text-muted">
                  SEO description (recommended 140-160)
                </span>
                <textarea
                  name="seoDescription"
                  value={seoDescription}
                  onChange={(event) => setSeoDescription(event.target.value)}
                  maxLength={160}
                  rows={3}
                  className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
                <span className="text-xs text-muted">{seoDescription.length}/160</span>
              </label>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[24px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(242,236,228,0.86))] p-5 shadow-[0_16px_28px_rgba(107,79,58,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Canonical preview</p>
            <p className="mt-3 break-all text-sm text-dark">{canonicalUrl}</p>
          </article>

          <article className="rounded-[24px] border border-brown/10 bg-white p-5 shadow-[0_16px_28px_rgba(107,79,58,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Search snippet preview</p>
            <p className="mt-4 text-[13px] text-[#1a0dab]">{snippetTitle}</p>
            <p className="mt-1 text-xs text-[#0a7d2a]">{canonicalUrl}</p>
            <p className="mt-2 text-[13px] leading-6 text-[#4d5156]">{snippetDescription}</p>
          </article>
        </aside>
      </section>

      <div className="mt-7 flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-olive px-7 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
