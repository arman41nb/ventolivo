import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";
import { getAllProducts } from "@/services/products";
import { getPublishedBlogPosts } from "@/services/blog";
import { getSiteLocales } from "@/services/site-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locales, products, posts] = await Promise.all([
    getSiteLocales(),
    getAllProducts(),
    getPublishedBlogPosts(),
  ]);

  const localeCodes = locales.map((locale) => locale.code);
  const staticEntries = localeCodes.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      changeFrequency: "daily" as const,
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/${locale}/products`,
      changeFrequency: "daily" as const,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/${locale}/blog`,
      changeFrequency: "daily" as const,
      priority: 0.85,
      lastModified: new Date(),
    },
  ]);

  const productEntries = products.flatMap((product) =>
    localeCodes.map((locale) => ({
      url: `${siteConfig.url}/${locale}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      lastModified: new Date(),
    })),
  );

  const postEntries = posts.flatMap((post) =>
    localeCodes.map((locale) => ({
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: post.updatedAt,
    })),
  );

  return [...staticEntries, ...productEntries, ...postEntries];
}

