export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: BlogPostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
}

export interface BlogPostFilter {
  tag?: string;
  limit?: number;
}

