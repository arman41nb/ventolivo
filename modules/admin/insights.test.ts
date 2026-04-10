import { describe, expect, it } from "vitest";
import {
  buildAdminFocusItems,
  buildAdminMediaInsights,
  buildAdminProductInsights,
} from "./insights";
import type { MediaLibraryAsset, Product, SiteLocaleConfig } from "@/types";

const locales: SiteLocaleConfig[] = [
  { code: "en", label: "English", direction: "ltr" },
  { code: "tr", label: "Turkish", direction: "ltr" },
  { code: "fa", label: "Persian", direction: "rtl" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Olive Soap",
    slug: "olive-soap",
    tag: "soap",
    price: 120,
    color: "#7C8C5E",
    description: "Cold processed olive soap for daily care.",
    featured: true,
    translations: {
      name: { tr: "Zeytin Sabunu", fa: "صابون زیتون" },
      tag: { tr: "sabun", fa: "صابون" },
      description: {
        tr: "صابون زیتون برای استفاده روزانه.",
        fa: "صابون زیتون برای استفاده روزانه.",
      },
    },
    media: [
      { assetId: "asset-cover", type: "image", role: "cover", url: "/cover.jpg" },
      { assetId: "asset-gallery", type: "image", role: "gallery", url: "/gallery.jpg" },
    ],
  },
  {
    id: 2,
    name: "Lavender Candle",
    slug: "lavender-candle",
    tag: "candle",
    price: 220,
    color: "#D7B5C8",
    description: "A soft candle with a clean lavender note.",
    translations: {
      name: { tr: "Lavanta Mum" },
      tag: { tr: "mum" },
      description: { tr: "Lavanta notalı yumuşak bir mum." },
    },
    media: [],
  },
];

const mediaAssets: MediaLibraryAsset[] = [
  {
    id: "asset-cover",
    kind: "image",
    url: "/cover.jpg",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "asset-gallery",
    kind: "image",
    url: "/gallery.jpg",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "asset-video",
    kind: "video",
    url: "/video.mp4",
    thumbnailUrl: "/video.jpg",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
];

describe("admin insights", () => {
  it("summarizes product localization and media health", () => {
    const summary = buildAdminProductInsights(products, locales);

    expect(summary.totalProducts).toBe(2);
    expect(summary.featuredProducts).toBe(1);
    expect(summary.productsWithCover).toBe(1);
    expect(summary.productsMissingMedia).toBe(1);
    expect(summary.productsMissingTranslations).toBe(1);
    expect(summary.fullyLocalizedProducts).toBe(1);
    expect(summary.productRows.find((product) => product.productId === 2)?.missingTranslationLocales).toEqual([
      "fa",
    ]);
  });

  it("detects unused media assets", () => {
    const mediaSummary = buildAdminMediaInsights(mediaAssets, products);

    expect(mediaSummary.totalAssets).toBe(3);
    expect(mediaSummary.imageAssets).toBe(2);
    expect(mediaSummary.videoAssets).toBe(1);
    expect(mediaSummary.unusedAssets).toBe(1);
  });

  it("builds actionable focus items for the dashboard", () => {
    const productInsights = buildAdminProductInsights(products, locales);
    const mediaInsights = buildAdminMediaInsights(mediaAssets, products);
    const focusItems = buildAdminFocusItems({
      productInsights,
      mediaInsights,
      locales,
    });

    expect(focusItems).toHaveLength(3);
    expect(focusItems[0]?.label).toBe("Translation coverage");
    expect(focusItems[1]?.description).toContain("cover image");
  });
});
