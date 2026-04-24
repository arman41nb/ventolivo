import type { BlogPost, BlogPostFilter, BlogPostInput } from "@/types";
import { getBlogRepository } from "../infrastructure/get-blog-repository";

export async function getPublishedBlogPosts(filter?: BlogPostFilter): Promise<BlogPost[]> {
  return getBlogRepository().getPublishedPosts(filter);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogRepository().getPublishedPostBySlug(slug);
}

export async function getAllBlogPosts(filter?: BlogPostFilter): Promise<BlogPost[]> {
  return getBlogRepository().getAllPosts(filter);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  return getBlogRepository().getPostById(id);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogRepository().getPostBySlug(slug);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  return getBlogRepository().createPost(input);
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<BlogPost> {
  return getBlogRepository().updatePost(id, input);
}

export async function deleteBlogPost(id: number): Promise<void> {
  return getBlogRepository().deletePost(id);
}

