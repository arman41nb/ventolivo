import { z } from "zod";
import { defaultLocale, type Locale } from "@/i18n/config";
import { assetPathSchema, requiredAssetPathSchema } from "@/lib/validations";
import type {
  LocalizedFieldMap,
  Product,
  ProductMediaItem,
  ProductTranslations,
  ProductUpsertInput,
} from "@/types";

const productIngredientsSchema = z.array(z.string());
const localizedFieldMapSchema = z.record(z.string().trim().min(2).max(16), z.string().trim());
const dbProductMediaLinkSchema = z.object({
  role: z.string(),
  sortOrder: z.number().int(),
  mediaAsset: z.object({
    id: z.string(),
    kind: z.string(),
    url: requiredAssetPathSchema,
    altText: z.string().nullable().optional(),
    thumbnailUrl: assetPathSchema.nullable().optional(),
    label: z.string().nullable().optional(),
  }),
});

const dbProductRecordSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  slug: z.string().min(1),
  tag: z.string().min(1),
  price: z.number().int().nonnegative(),
  color: z.string().min(1),
  description: z.string().min(1),
  ingredients: z.string().nullable(),
  weight: z.string().nullable(),
  featured: z.boolean(),
  nameTranslations: z.string().nullable().optional(),
  tagTranslations: z.string().nullable().optional(),
  descriptionTranslations: z.string().nullable().optional(),
  mediaLinks: z.array(z.unknown()).optional().default([]),
});

export type DbProductRecord = z.infer<typeof dbProductRecordSchema>;

export function normalizeProductMedia(
  media: ProductMediaItem[] | undefined,
): ProductMediaItem[] | undefined {
  if (!media || media.length === 0) {
    return undefined;
  }

  const normalized = media
    .map((item, index) => ({
      ...item,
      url: item.url.trim(),
      alt: item.alt?.trim(),
      thumbnailUrl: item.thumbnailUrl?.trim(),
      label: item.label?.trim(),
      role: item.role ?? (item.type === "video" ? "video" : index === 0 ? "cover" : "gallery"),
      sortOrder: item.sortOrder ?? index,
    }))
    .filter((item) => item.url.length > 0 || Boolean(item.assetId));

  return normalized.length > 0 ? normalized : undefined;
}

export function normalizeProductTag(tag: string): string {
  return tag.trim().toLocaleLowerCase();
}

export function parseProductIngredients(
  ingredients: string | null | undefined,
): string[] | undefined {
  if (!ingredients) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(ingredients);
    const result = productIngredientsSchema.safeParse(parsed);

    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function parseLocalizedFieldMap(
  value: string | null | undefined,
): LocalizedFieldMap | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    const result = localizedFieldMapSchema.safeParse(parsed);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function mapDbProductRecord(record: DbProductRecord): Product {
  const product = dbProductRecordSchema.parse(record);
  const mediaLinks = product.mediaLinks.flatMap((link) => {
    const result = dbProductMediaLinkSchema.safeParse(link);
    return result.success ? [result.data] : [];
  });
  const translations = normalizeProductTranslations({
    name: parseLocalizedFieldMap(product.nameTranslations),
    tag: parseLocalizedFieldMap(product.tagTranslations),
    description: parseLocalizedFieldMap(product.descriptionTranslations),
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tag: product.tag,
    price: product.price,
    color: product.color,
    description: product.description,
    ingredients: parseProductIngredients(product.ingredients),
    weight: product.weight ?? undefined,
    featured: product.featured,
    translations,
    media: normalizeProductMedia(
      mediaLinks.map((link) => ({
        id: link.mediaAsset.id,
        assetId: link.mediaAsset.id,
        type: link.mediaAsset.kind === "video" ? "video" : "image",
        url: link.mediaAsset.url,
        alt: link.mediaAsset.altText ?? undefined,
        thumbnailUrl: link.mediaAsset.thumbnailUrl ?? undefined,
        label: link.mediaAsset.label ?? undefined,
        role: link.role === "video" ? "video" : link.role === "cover" ? "cover" : "gallery",
        sortOrder: link.sortOrder,
      })),
    ),
  };
}

export function serializeProductIngredients(
  ingredients: ProductUpsertInput["ingredients"],
): string | null {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return JSON.stringify(ingredients);
}

export function serializeLocalizedFieldMap(value: LocalizedFieldMap | undefined): string | null {
  if (!value || Object.keys(value).length === 0) {
    return null;
  }

  return JSON.stringify(value);
}

export function resolveLocalizedField(
  baseValue: string,
  localizedValue: LocalizedFieldMap | undefined,
  locale?: Locale,
): string {
  if (!locale) {
    return baseValue;
  }

  return localizedValue?.[locale] || localizedValue?.[defaultLocale] || baseValue;
}

export function resolveLocalizedProduct(product: Product, locale?: Locale): Product {
  return {
    ...product,
    name: resolveLocalizedField(product.name, product.translations?.name, locale),
    tag: resolveLocalizedField(product.tag, product.translations?.tag, locale),
    description: resolveLocalizedField(
      product.description,
      product.translations?.description,
      locale,
    ),
  };
}

export function normalizeProductTranslations(
  translations: ProductTranslations | undefined,
): ProductTranslations | undefined {
  if (!translations) {
    return undefined;
  }

  const normalized: ProductTranslations = {};

  for (const key of ["name", "tag", "description"] as const) {
    const value = translations[key];
    if (!value) {
      continue;
    }

    const filtered = Object.fromEntries(
      Object.entries(value).flatMap(([locale, text]) => {
        if (typeof text !== "string") {
          return [];
        }

        const normalizedText = text.trim();

        return normalizedText.length > 0 ? [[locale, normalizedText]] : [];
      }),
    ) as LocalizedFieldMap;

    if (Object.keys(filtered).length > 0) {
      normalized[key] = filtered;
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}
