import type { BlogPost, BlogPostFilter, BlogPostInput } from "@/types";

export interface BlogRepository {
  getPublishedPosts(filter?: BlogPostFilter): Promise<BlogPost[]>;
  getPublishedPostBySlug(slug: string): Promise<BlogPost | null>;
  getAllPosts(filter?: BlogPostFilter): Promise<BlogPost[]>;
  getPostById(id: number): Promise<BlogPost | null>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  createPost(input: BlogPostInput): Promise<BlogPost>;
  updatePost(id: number, input: BlogPostInput): Promise<BlogPost>;
  deletePost(id: number): Promise<void>;
}

