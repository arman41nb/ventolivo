import { env } from "@/lib/env";
import type { BlogRepository } from "../domain/contracts";
import { mockBlogRepository } from "./mock-blog-repository";
import { prismaBlogRepository } from "./prisma-blog-repository";

export function getBlogRepository(): BlogRepository {
  return env.BLOG_DATA_SOURCE === "mock" ? mockBlogRepository : prismaBlogRepository;
}

