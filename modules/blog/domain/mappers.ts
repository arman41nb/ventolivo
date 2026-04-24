import type { BlogPost } from "@/types";

export interface DbBlogPostRecord {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string | null;
  coverImage: string | null;
  coverAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const statusSet = new Set(["draft", "published"]);

export function normalizeBlogTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function parseBlogTags(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => normalizeBlogTag(item))
        .filter(Boolean),
    ),
  );
}

export function serializeBlogTags(tags: string[] | undefined): string | null {
  if (!tags || tags.length === 0) {
    return null;
  }

  const normalizedTags = Array.from(new Set(tags.map((tag) => normalizeBlogTag(tag)).filter(Boolean)));

  return normalizedTags.length > 0 ? normalizedTags.join(",") : null;
}

export function normalizeBlogStatus(value: string | undefined): "draft" | "published" {
  if (!value) {
    return "draft";
  }

  const normalizedValue = value.trim().toLowerCase();
  return statusSet.has(normalizedValue) ? (normalizedValue as "draft" | "published") : "draft";
}

export function mapDbBlogPostRecord(record: DbBlogPostRecord): BlogPost {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    tags: parseBlogTags(record.tags),
    coverImage: record.coverImage ?? undefined,
    coverAlt: record.coverAlt ?? undefined,
    seoTitle: record.seoTitle ?? undefined,
    seoDescription: record.seoDescription ?? undefined,
    status: normalizeBlogStatus(record.status),
    publishedAt: record.publishedAt ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

