import type { Metadata } from "next";
import { siteConfig } from "@/config";

interface PageSEOOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export function generatePageMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image,
}: PageSEOOptions = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.description}`;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  };
}
