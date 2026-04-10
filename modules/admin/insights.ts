import { defaultLocale } from "@/i18n/config";
import type { MediaLibraryAsset, Product, SiteLocaleConfig } from "@/types";

type ProductTranslationField = "name" | "tag" | "description";

export interface AdminProductInsight {
  productId: number;
  slug: string;
  name: string;
  missingTranslationLocales: string[];
  hasCover: boolean;
  hasGallery: boolean;
  hasVideo: boolean;
  mediaCount: number;
}

export interface AdminProductInsightsSummary {
  totalProducts: number;
  featuredProducts: number;
  productsWithCover: number;
  productsWithGallery: number;
  productsWithVideo: number;
  productsMissingMedia: number;
  productsMissingTranslations: number;
  fullyLocalizedProducts: number;
  totalMissingTranslationLocales: number;
  averagePrice: number;
  productRows: AdminProductInsight[];
}

export interface AdminMediaInsightsSummary {
  totalAssets: number;
  imageAssets: number;
  videoAssets: number;
  unusedAssets: number;
  reusedAssets: number;
}

export interface AdminFocusItem {
  id: string;
  tone: "critical" | "warning" | "success";
  label: string;
  value: string;
  description: string;
}

function hasRequiredTranslation(
  product: Product,
  localeCode: string,
  field: ProductTranslationField,
): boolean {
  if (localeCode === defaultLocale) {
    const value = product[field];
    return typeof value === "string" && value.trim().length > 0;
  }

  const translationMap = product.translations?.[field] as Record<string, string> | undefined;
  const localizedValue = translationMap?.[localeCode];
  return typeof localizedValue === "string" && localizedValue.trim().length > 0;
}

function getMissingTranslationLocales(product: Product, locales: SiteLocaleConfig[]): string[] {
  return locales
    .map((locale) => locale.code)
    .filter((localeCode) =>
      ["name", "tag", "description"].some(
        (field) => !hasRequiredTranslation(product, localeCode, field as ProductTranslationField),
      ),
    );
}

export function buildAdminProductInsights(
  products: Product[],
  locales: SiteLocaleConfig[],
): AdminProductInsightsSummary {
  const productRows = products.map<AdminProductInsight>((product) => {
    const productMedia = product.media ?? [];
    const hasCover = productMedia.some((item) => item.role === "cover" && item.type === "image");
    const hasGallery = productMedia.some(
      (item) => item.role === "gallery" && item.type === "image",
    );
    const hasVideo = productMedia.some((item) => item.type === "video");

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      missingTranslationLocales: getMissingTranslationLocales(product, locales),
      hasCover,
      hasGallery,
      hasVideo,
      mediaCount: productMedia.length,
    };
  });

  const productsMissingMedia = productRows.filter((product) => !product.hasCover).length;
  const productsMissingTranslations = productRows.filter(
    (product) => product.missingTranslationLocales.length > 0,
  ).length;
  const fullyLocalizedProducts = productRows.filter(
    (product) => product.missingTranslationLocales.length === 0,
  ).length;
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return {
    totalProducts: products.length,
    featuredProducts: products.filter((product) => product.featured).length,
    productsWithCover: productRows.filter((product) => product.hasCover).length,
    productsWithGallery: productRows.filter((product) => product.hasGallery).length,
    productsWithVideo: productRows.filter((product) => product.hasVideo).length,
    productsMissingMedia,
    productsMissingTranslations,
    fullyLocalizedProducts,
    totalMissingTranslationLocales: productRows.reduce(
      (sum, product) => sum + product.missingTranslationLocales.length,
      0,
    ),
    averagePrice: products.length > 0 ? Math.round(totalPrice / products.length) : 0,
    productRows,
  };
}

export function buildAdminMediaInsights(
  assets: MediaLibraryAsset[],
  products: Product[],
): AdminMediaInsightsSummary {
  const assetUsageCount = new Map<string, number>();

  for (const product of products) {
    for (const assetId of (product.media ?? []).map((item) => item.assetId).filter(Boolean) as string[]) {
      assetUsageCount.set(assetId, (assetUsageCount.get(assetId) ?? 0) + 1);
    }
  }

  return {
    totalAssets: assets.length,
    imageAssets: assets.filter((asset) => asset.kind === "image").length,
    videoAssets: assets.filter((asset) => asset.kind === "video").length,
    unusedAssets: assets.filter((asset) => !assetUsageCount.has(asset.id)).length,
    reusedAssets: Array.from(assetUsageCount.values()).filter((count) => count > 1).length,
  };
}

export function buildAdminFocusItems(input: {
  productInsights: AdminProductInsightsSummary;
  mediaInsights: AdminMediaInsightsSummary;
  locales: SiteLocaleConfig[];
}): AdminFocusItem[] {
  const { productInsights, mediaInsights, locales } = input;
  const translationCoverage =
    productInsights.totalProducts === 0
      ? 100
      : Math.round(
          (productInsights.fullyLocalizedProducts / Math.max(productInsights.totalProducts, 1)) * 100,
        );

  return [
    {
      id: "translation-coverage",
      tone: translationCoverage === 100 ? "success" : translationCoverage >= 60 ? "warning" : "critical",
      label: "Translation coverage",
      value: `${translationCoverage}%`,
      description: `${productInsights.fullyLocalizedProducts} of ${productInsights.totalProducts} products are complete across ${locales.length} locales.`,
    },
    {
      id: "catalog-media",
      tone: productInsights.productsMissingMedia === 0 ? "success" : "warning",
      label: "Cover media health",
      value: `${productInsights.totalProducts - productInsights.productsMissingMedia}/${productInsights.totalProducts}`,
      description:
        productInsights.productsMissingMedia === 0
          ? "Every product has a cover image."
          : `${productInsights.productsMissingMedia} product records still need a cover image.`,
    },
    {
      id: "media-usage",
      tone: mediaInsights.unusedAssets === 0 ? "success" : "warning",
      label: "Media utilization",
      value: `${mediaInsights.totalAssets - mediaInsights.unusedAssets}/${mediaInsights.totalAssets || 0}`,
      description:
        mediaInsights.unusedAssets === 0
          ? "Every uploaded media asset is connected to the catalog."
          : `${mediaInsights.unusedAssets} media assets are currently unused in products.`,
    },
  ];
}
