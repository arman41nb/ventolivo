"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct, deleteProduct, updateProduct } from "@/services/products";
import { productAdminSchema } from "@/lib/validations";
import { recordAdminAuditLog, requireAdminSession } from "@/services/admin-auth";
import { getMediaAssetsByIds } from "@/services/media";
import { getSiteLocales } from "@/services/site-content";

type ProductTranslationDraftFields = {
  name: string;
  tag: string;
  description: string;
  weight: string;
  ingredients: string;
};

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseTranslatedProductInput(
  formData: FormData,
  allowedLocales: Set<string>,
): Partial<Record<string, ProductTranslationDraftFields>> {
  const rawValue = getStringValue(formData, "translatedProductJson");

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    const translations: Partial<Record<string, ProductTranslationDraftFields>> = {};

    for (const [locale, value] of Object.entries(parsed)) {
      if (!allowedLocales.has(locale) || !value || typeof value !== "object") {
        continue;
      }

      const candidate = value as Record<string, unknown>;
      translations[locale] = {
        name: typeof candidate.name === "string" ? candidate.name.trim() : "",
        tag: typeof candidate.tag === "string" ? candidate.tag.trim() : "",
        description: typeof candidate.description === "string" ? candidate.description.trim() : "",
        weight: typeof candidate.weight === "string" ? candidate.weight.trim() : "",
        ingredients: typeof candidate.ingredients === "string" ? candidate.ingredients.trim() : "",
      };
    }

    return translations;
  } catch {
    throw new Error("Invalid translated product content");
  }
}

async function getProductInput(formData: FormData) {
  const result = productAdminSchema.safeParse({
    name: getStringValue(formData, "name"),
    slug: getStringValue(formData, "slug"),
    tag: getStringValue(formData, "tag"),
    price: getStringValue(formData, "price"),
    color: getStringValue(formData, "color"),
    description: getStringValue(formData, "description"),
    ingredients: getStringValue(formData, "ingredients"),
    weight: getStringValue(formData, "weight"),
    featured: formData.get("featured") === "on",
  });

  if (!result.success) {
    throw new Error("Invalid product form data");
  }

  const siteLocales = await getSiteLocales();
  const localeCodes = siteLocales.map((locale) => locale.code);
  const stagedTranslations = parseTranslatedProductInput(formData, new Set(localeCodes));

  const translations = Object.fromEntries(
    ["name", "tag", "description", "weight", "ingredients"].map((field) => {
      const localizedEntries = localeCodes.flatMap((locale) => {
        const stagedValue = stagedTranslations[locale]?.[
          field as keyof ProductTranslationDraftFields
        ];
        const rawValue =
          getStringValue(formData, `translations.${field}.${locale}`) || stagedValue || "";

        if (field === "ingredients") {
          const items = rawValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

          return items.length > 0 ? [[locale, items]] : [];
        }

        return rawValue.trim().length > 0 ? [[locale, rawValue.trim()]] : [];
      });

      return [field, Object.fromEntries(localizedEntries)];
    }),
  );

  const coverImageUrl = getStringValue(formData, "coverImageUrl").trim();
  const coverImageAlt = getStringValue(formData, "coverImageAlt").trim();
  const videoUrl = getStringValue(formData, "videoUrl").trim();
  const videoThumbnailUrl = getStringValue(formData, "videoThumbnailUrl").trim();
  const galleryImages = getStringValue(formData, "galleryImages")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const coverAssetId = getStringValue(formData, "coverAssetId").trim();
  const galleryAssetIds = formData
    .getAll("galleryAssetIds")
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  const videoAssetId = getStringValue(formData, "videoAssetId").trim();
  const selectedAssetIds = Array.from(
    new Set([coverAssetId, videoAssetId, ...galleryAssetIds].filter(Boolean)),
  );
  const selectedAssets = await getMediaAssetsByIds(selectedAssetIds);
  const assetMap = new Map(selectedAssets.map((asset) => [asset.id, asset]));

  const media = [
    ...(coverAssetId && assetMap.get(coverAssetId)
      ? [
          {
            assetId: coverAssetId,
            type: "image" as const,
            role: "cover" as const,
            url: assetMap.get(coverAssetId)!.url,
            alt: assetMap.get(coverAssetId)!.altText || result.data.name,
            thumbnailUrl: assetMap.get(coverAssetId)!.thumbnailUrl,
            sortOrder: 0,
          },
        ]
      : []),
    ...(!coverAssetId && coverImageUrl
      ? [
          {
            type: "image" as const,
            role: "cover" as const,
            url: coverImageUrl,
            alt: coverImageAlt || result.data.name,
            sortOrder: 0,
          },
        ]
      : []),
    ...galleryImages.map((line, index) => {
      const [urlPart, altPart] = line.split("|").map((item) => item.trim());

      return {
        type: "image" as const,
        role: "gallery" as const,
        url: urlPart,
        alt: altPart || result.data.name,
        sortOrder: index + 1,
      };
    }),
    ...galleryAssetIds
      .filter((assetId) => assetId !== coverAssetId && assetMap.has(assetId))
      .map((assetId, index) => {
        const asset = assetMap.get(assetId)!;

        return {
          assetId,
          type: "image" as const,
          role: "gallery" as const,
          url: asset.url,
          alt: asset.altText || result.data.name,
          thumbnailUrl: asset.thumbnailUrl,
          sortOrder: index + (coverAssetId || coverImageUrl ? 1 : 0),
        };
      }),
    ...(videoAssetId && assetMap.get(videoAssetId)
      ? [
          {
            assetId: videoAssetId,
            type: "video" as const,
            role: "video" as const,
            url: assetMap.get(videoAssetId)!.url,
            alt: assetMap.get(videoAssetId)!.altText || `${result.data.name} video`,
            thumbnailUrl: assetMap.get(videoAssetId)!.thumbnailUrl,
            sortOrder:
              galleryImages.length +
              galleryAssetIds.length +
              (coverAssetId || coverImageUrl ? 1 : 0),
          },
        ]
      : []),
    ...(!videoAssetId && videoUrl
      ? [
          {
            type: "video" as const,
            role: "video" as const,
            url: videoUrl,
            alt: `${result.data.name} video`,
            thumbnailUrl: videoThumbnailUrl || undefined,
            sortOrder: galleryImages.length + (coverImageUrl ? 1 : 0),
          },
        ]
      : []),
  ];

  return {
    name: result.data.name,
    slug: result.data.slug,
    tag: result.data.tag,
    price: result.data.price,
    color: result.data.color,
    description: result.data.description,
    ingredients: result.data.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    weight: result.data.weight || undefined,
    featured: result.data.featured,
    translations,
    media,
  };
}

async function revalidateProductPages() {
  const siteLocales = await getSiteLocales();

  for (const locale of siteLocales.map((siteLocale) => siteLocale.code)) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/products`);
  }
}

function getAdminProductsPath(locale: string, params?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();

  return query ? `/${locale}/admin/products?${query}` : `/${locale}/admin/products`;
}

function isUniqueSlugError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createProductAction(formData: FormData) {
  const session = await requireAdminSession();

  const locale = getStringValue(formData, "locale");

  try {
    const product = await createProduct(await getProductInput(formData));
    await recordAdminAuditLog({
      action: "product.created",
      adminUserId: session.user.id,
      actorLabel: session.user.username,
      targetType: "product",
      targetId: String(product.id),
      metadata: `Created product ${product.slug}.`,
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(`/${locale}/admin/products/new?error=slug-conflict`);
    }

    throw error;
  }

  await revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "created" }));
}

export async function updateProductAction(formData: FormData) {
  const session = await requireAdminSession();

  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id");
  }

  try {
    const product = await updateProduct(id, await getProductInput(formData));
    await recordAdminAuditLog({
      action: "product.updated",
      adminUserId: session.user.id,
      actorLabel: session.user.username,
      targetType: "product",
      targetId: String(product.id),
      metadata: `Updated product ${product.slug}.`,
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(`/${locale}/admin/products/${id}?error=slug-conflict`);
    }

    throw error;
  }

  await revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "updated" }));
}

export async function deleteProductAction(formData: FormData) {
  const session = await requireAdminSession();

  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id");
  }

  await deleteProduct(id);
  await recordAdminAuditLog({
    action: "product.deleted",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "product",
    targetId: String(id),
    metadata: "Deleted product from admin inventory.",
  });
  await revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "deleted" }));
}
