import { Prisma } from "@prisma/client";
import { prisma } from "./client";
import {
  type DbProductRecord,
  mapDbProductRecord,
  normalizeProductTag,
  normalizeProductMedia,
  serializeProductIngredients,
  serializeLocalizedFieldMap,
} from "@/modules/products/mappers";
import type { Product, ProductUpsertInput } from "@/types";

const productInclude = {
  mediaLinks: {
    include: {
      mediaAsset: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
} as const;

function mapProductMediaCreateInput(input: ProductUpsertInput) {
  const media = normalizeProductMedia(input.media);

  if (!media) {
    return undefined;
  }

  return {
    create: media.map((item, index) => ({
      role: item.role ?? (item.type === "video" ? "video" : index === 0 ? "cover" : "gallery"),
      sortOrder: item.sortOrder ?? index,
      mediaAsset: item.assetId
        ? {
            connect: {
              id: item.assetId,
            },
          }
        : {
            create: {
              kind: item.type,
              url: item.url,
              altText: item.alt ?? null,
              thumbnailUrl: item.thumbnailUrl ?? null,
              label: item.label ?? null,
            },
          },
    })),
  };
}

export async function dbGetAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });
  return products.map(mapDbProductRecord);
}

export async function dbGetFeaturedProducts(count = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: count,
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });
  return products.map(mapDbProductRecord);
}

export async function dbGetProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return product ? mapDbProductRecord(product) : null;
}

export async function dbGetProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return product ? mapDbProductRecord(product) : null;
}

export async function dbGetProductsByTag(tag: string): Promise<Product[]> {
  const normalizedTag = normalizeProductTag(tag);
  const products = await prisma.$queryRaw<DbProductRecord[]>(Prisma.sql`
    SELECT
      "id",
      "name",
      "slug",
      "tag",
      "price",
      "color",
      "description",
      "ingredients",
      "weight",
      "featured",
      "nameTranslations",
      "tagTranslations",
      "descriptionTranslations"
    FROM "Product"
    WHERE lower(trim("tag")) = ${normalizedTag}
    ORDER BY "createdAt" DESC
  `);

  const hydratedProducts = await prisma.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  return hydratedProducts.map(mapDbProductRecord);
}

export async function dbCreateProduct(input: ProductUpsertInput): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      tag: input.tag,
      price: input.price,
      color: input.color,
      description: input.description,
      ingredients: serializeProductIngredients(input.ingredients),
      weight: input.weight ?? null,
      featured: input.featured ?? false,
      nameTranslations: serializeLocalizedFieldMap(input.translations?.name),
      tagTranslations: serializeLocalizedFieldMap(input.translations?.tag),
      descriptionTranslations: serializeLocalizedFieldMap(
        input.translations?.description,
      ),
      mediaLinks: mapProductMediaCreateInput(input),
    },
    include: productInclude,
  });

  return mapDbProductRecord(product);
}

export async function dbUpdateProduct(
  id: number,
  input: ProductUpsertInput,
): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      tag: input.tag,
      price: input.price,
      color: input.color,
      description: input.description,
      ingredients: serializeProductIngredients(input.ingredients),
      weight: input.weight ?? null,
      featured: input.featured ?? false,
      nameTranslations: serializeLocalizedFieldMap(input.translations?.name),
      tagTranslations: serializeLocalizedFieldMap(input.translations?.tag),
      descriptionTranslations: serializeLocalizedFieldMap(
        input.translations?.description,
      ),
      mediaLinks: {
        deleteMany: {},
        ...(mapProductMediaCreateInput(input) ?? {}),
      },
    },
    include: productInclude,
  });

  return mapDbProductRecord(product);
}

export async function dbDeleteProduct(id: number): Promise<void> {
  await prisma.product.delete({
    where: { id },
  });
}
