import { mockBlogPosts } from "@/data/blog-posts";
import type { BlogPost, BlogPostFilter, BlogPostInput } from "@/types";
import type { BlogRepository } from "../domain/contracts";
import { normalizeBlogTag } from "../domain/mappers";

function filterByTag(posts: BlogPost[], filter?: BlogPostFilter): BlogPost[] {
  if (!filter?.tag) {
    return posts;
  }

  const normalizedTag = normalizeBlogTag(filter.tag);
  return posts.filter((post) => post.tags.some((tag) => tag === normalizedTag));
}

function applyLimit(posts: BlogPost[], filter?: BlogPostFilter): BlogPost[] {
  if (!filter?.limit || filter.limit < 1) {
    return posts;
  }

  return posts.slice(0, filter.limit);
}

const sortedMockPosts = [...mockBlogPosts].sort((left, right) => {
  const leftDate = left.publishedAt ?? left.createdAt;
  const rightDate = right.publishedAt ?? right.createdAt;
  return rightDate.getTime() - leftDate.getTime();
});

export const mockBlogRepository: BlogRepository = {
  async getPublishedPosts(filter) {
    const posts = sortedMockPosts.filter((post) => post.status === "published");
    return applyLimit(filterByTag(posts, filter), filter);
  },
  async getPublishedPostBySlug(slug) {
    return (
      sortedMockPosts.find((post) => post.slug === slug && post.status === "published") ?? null
    );
  },
  async getAllPosts(filter) {
    return applyLimit(filterByTag(sortedMockPosts, filter), filter);
  },
  async getPostById(id) {
    return sortedMockPosts.find((post) => post.id === id) ?? null;
  },
  async getPostBySlug(slug) {
    return sortedMockPosts.find((post) => post.slug === slug) ?? null;
  },
  async createPost(input: BlogPostInput) {
    const now = new Date();
    const created: BlogPost = {
      id: sortedMockPosts.length + 1,
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      content: input.content,
      tags: input.tags ?? [],
      coverImage: input.coverImage,
      coverAlt: input.coverAlt,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      status: input.status ?? "draft",
      publishedAt: input.publishedAt,
      createdAt: now,
      updatedAt: now,
    };
    sortedMockPosts.unshift(created);
    return created;
  },
  async updatePost(id, input) {
    const index = sortedMockPosts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new Error("Blog post not found");
    }

    const existing = sortedMockPosts[index];
    const updated: BlogPost = {
      ...existing,
      ...input,
      tags: input.tags ?? existing.tags,
      status: input.status ?? existing.status,
      updatedAt: new Date(),
    };
    sortedMockPosts[index] = updated;
    return updated;
  },
  async deletePost(id) {
    const index = sortedMockPosts.findIndex((post) => post.id === id);

    if (index !== -1) {
      sortedMockPosts.splice(index, 1);
    }
  },
};

