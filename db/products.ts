import { prisma } from "./client";
import { mapDbProductRecord, normalizeProductTag } from "@/modules/products/mappers";
import type { Product } from "@/types";

export async function dbGetAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapDbProductRecord);
}

export async function dbGetFeaturedProducts(count = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: count,
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapDbProductRecord);
}

export async function dbGetProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  return product ? mapDbProductRecord(product) : null;
}

export async function dbGetProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product ? mapDbProductRecord(product) : null;
}

export async function dbGetProductsByTag(tag: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedTag = normalizeProductTag(tag);

  return products
    .map(mapDbProductRecord)
    .filter((product) => normalizeProductTag(product.tag) === normalizedTag);
}
