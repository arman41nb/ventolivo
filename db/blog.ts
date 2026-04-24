import { Prisma } from "@prisma/client";
import { prisma } from "./client";
import { mapDbBlogPostRecord, normalizeBlogTag, serializeBlogTags } from "@/modules/blog";
import type { DbBlogPostRecord } from "@/modules/blog/domain/mappers";
import type { BlogPost, BlogPostFilter, BlogPostInput } from "@/types";

function buildTagContainsPattern(tag: string): Prisma.Sql {
  const normalizedTag = normalizeBlogTag(tag);
  return Prisma.sql`(',' || lower(coalesce("tags", '')) || ',') LIKE ${`%,${normalizedTag},%`}`;
}

function buildLimitClause(limit: number | undefined): Prisma.Sql {
  if (!limit || limit < 1) {
    return Prisma.sql``;
  }

  return Prisma.sql`LIMIT ${limit}`;
}

export async function dbGetPublishedBlogPosts(filter?: BlogPostFilter): Promise<BlogPost[]> {
  const limit = filter?.limit;
  const whereTag = filter?.tag ? buildTagContainsPattern(filter.tag) : Prisma.sql`1 = 1`;

  const posts = await prisma.$queryRaw<DbBlogPostRecord[]>(Prisma.sql`
    SELECT *
    FROM "BlogPost"
    WHERE "status" = 'published'
      AND "publishedAt" IS NOT NULL
      AND ${whereTag}
    ORDER BY "publishedAt" DESC, "createdAt" DESC
    ${buildLimitClause(limit)}
  `);

  return posts.map(mapDbBlogPostRecord);
}

export async function dbGetPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
      publishedAt: {
        not: null,
      },
    },
  });

  return post ? mapDbBlogPostRecord(post) : null;
}

export async function dbGetAllBlogPosts(filter?: BlogPostFilter): Promise<BlogPost[]> {
  const limit = filter?.limit;
  const whereTag = filter?.tag ? buildTagContainsPattern(filter.tag) : Prisma.sql`1 = 1`;

  const posts = await prisma.$queryRaw<DbBlogPostRecord[]>(Prisma.sql`
    SELECT *
    FROM "BlogPost"
    WHERE ${whereTag}
    ORDER BY
      CASE WHEN "publishedAt" IS NULL THEN 1 ELSE 0 END ASC,
      "publishedAt" DESC,
      "createdAt" DESC
    ${buildLimitClause(limit)}
  `);

  return posts.map(mapDbBlogPostRecord);
}

export async function dbGetBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  return post ? mapDbBlogPostRecord(post) : null;
}

export async function dbGetBlogPostById(id: number): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  return post ? mapDbBlogPostRecord(post) : null;
}

export async function dbCreateBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const status = input.status ?? "draft";
  const post = await prisma.blogPost.create({
    data: {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      content: input.content,
      tags: serializeBlogTags(input.tags),
      coverImage: input.coverImage ?? null,
      coverAlt: input.coverAlt ?? null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      status,
      publishedAt: status === "published" ? input.publishedAt ?? new Date() : null,
    },
  });

  return mapDbBlogPostRecord(post);
}

export async function dbUpdateBlogPost(id: number, input: BlogPostInput): Promise<BlogPost> {
  const status = input.status ?? "draft";
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      content: input.content,
      tags: serializeBlogTags(input.tags),
      coverImage: input.coverImage ?? null,
      coverAlt: input.coverAlt ?? null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      status,
      publishedAt: status === "published" ? input.publishedAt ?? new Date() : null,
    },
  });

  return mapDbBlogPostRecord(post);
}

export async function dbDeleteBlogPost(id: number): Promise<void> {
  await prisma.blogPost.delete({
    where: { id },
  });
}

