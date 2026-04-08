import { env } from "@/lib/env";
import type { SiteContentRepository } from "../domain/contracts";
import { fallbackSiteContentRepository } from "./fallback-site-content-repository";
import { prismaSiteContentRepository } from "./prisma-site-content-repository";

export function getSiteContentRepository(): SiteContentRepository {
  return env.DATABASE_URL?.trim() ? prismaSiteContentRepository : fallbackSiteContentRepository;
}
