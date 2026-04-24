import type { BlogRepository } from "../domain/contracts";

export const prismaBlogRepository: BlogRepository = {
  async getPublishedPosts(filter) {
    const { dbGetPublishedBlogPosts } = await import("@/db");
    return dbGetPublishedBlogPosts(filter);
  },
  async getPublishedPostBySlug(slug) {
    const { dbGetPublishedBlogPostBySlug } = await import("@/db");
    return dbGetPublishedBlogPostBySlug(slug);
  },
  async getAllPosts(filter) {
    const { dbGetAllBlogPosts } = await import("@/db");
    return dbGetAllBlogPosts(filter);
  },
  async getPostById(id) {
    const { dbGetBlogPostById } = await import("@/db");
    return dbGetBlogPostById(id);
  },
  async getPostBySlug(slug) {
    const { dbGetBlogPostBySlug } = await import("@/db");
    return dbGetBlogPostBySlug(slug);
  },
  async createPost(input) {
    const { dbCreateBlogPost } = await import("@/db");
    return dbCreateBlogPost(input);
  },
  async updatePost(id, input) {
    const { dbUpdateBlogPost } = await import("@/db");
    return dbUpdateBlogPost(id, input);
  },
  async deletePost(id) {
    const { dbDeleteBlogPost } = await import("@/db");
    return dbDeleteBlogPost(id);
  },
};

