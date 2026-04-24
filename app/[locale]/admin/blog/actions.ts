"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { blogAdminSchema } from "@/lib/validations";
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from "@/services/blog";
import { recordAdminAuditLog, requireAdminSession } from "@/services/admin-auth";
import { getSiteLocales } from "@/services/site-content";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parsePublishedAt(value: string): Date | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseTags(value: string): string[] {
  if (!value.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function sanitizeRichHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

function extractVisibleText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getBlogInput(formData: FormData) {
  const result = blogAdminSchema.safeParse({
    slug: getStringValue(formData, "slug"),
    title: getStringValue(formData, "title"),
    summary: getStringValue(formData, "summary"),
    content: getStringValue(formData, "content"),
    tags: getStringValue(formData, "tags"),
    coverImage: getStringValue(formData, "coverImage"),
    coverAlt: getStringValue(formData, "coverAlt"),
    seoTitle: getStringValue(formData, "seoTitle"),
    seoDescription: getStringValue(formData, "seoDescription"),
    status: getStringValue(formData, "status"),
    publishedAt: getStringValue(formData, "publishedAt"),
  });

  if (!result.success) {
    throw new Error("Invalid blog form data");
  }

  const sanitizedContent = sanitizeRichHtml(result.data.content);
  const contentText = extractVisibleText(sanitizedContent);

  if (contentText.length < 80) {
    throw new Error("Content is too short");
  }

  return {
    slug: result.data.slug,
    title: result.data.title,
    summary: result.data.summary,
    content: sanitizedContent,
    tags: parseTags(result.data.tags),
    coverImage: result.data.coverImage || undefined,
    coverAlt: result.data.coverAlt || undefined,
    seoTitle: result.data.seoTitle || undefined,
    seoDescription: result.data.seoDescription || undefined,
    status: result.data.status,
    publishedAt: parsePublishedAt(result.data.publishedAt),
  };
}

async function revalidateBlogPages() {
  const siteLocales = await getSiteLocales();

  for (const locale of siteLocales.map((siteLocale) => siteLocale.code)) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/blog`);
  }

  revalidatePath("/sitemap.xml");
}

function getAdminBlogPath(locale: string, params?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `/${locale}/admin/blog?${query}` : `/${locale}/admin/blog`;
}

function isUniqueSlugError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createBlogPostAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale");

  try {
    const post = await createBlogPost(await getBlogInput(formData));
    await recordAdminAuditLog({
      action: "blog.created",
      adminUserId: session.user.id,
      actorLabel: session.user.username,
      targetType: "blog-post",
      targetId: String(post.id),
      metadata: `Created blog post ${post.slug}.`,
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(`/${locale}/admin/blog/new?error=slug-conflict`);
    }

    throw error;
  }

  await revalidateBlogPages();
  redirect(getAdminBlogPath(locale, { status: "created" }));
}

export async function updateBlogPostAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid blog post id");
  }

  try {
    const post = await updateBlogPost(id, await getBlogInput(formData));
    await recordAdminAuditLog({
      action: "blog.updated",
      adminUserId: session.user.id,
      actorLabel: session.user.username,
      targetType: "blog-post",
      targetId: String(post.id),
      metadata: `Updated blog post ${post.slug}.`,
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(`/${locale}/admin/blog/${id}?error=slug-conflict`);
    }

    throw error;
  }

  await revalidateBlogPages();
  redirect(getAdminBlogPath(locale, { status: "updated" }));
}

export async function deleteBlogPostAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid blog post id");
  }

  await deleteBlogPost(id);
  await recordAdminAuditLog({
    action: "blog.deleted",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "blog-post",
    targetId: String(id),
    metadata: "Deleted blog post from admin.",
  });
  await revalidateBlogPages();

  redirect(getAdminBlogPath(locale, { status: "deleted" }));
}
