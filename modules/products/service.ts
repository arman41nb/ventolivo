import { type Locale } from "@/i18n/config";
import { getProductRepository } from "@/repositories/products";
import type { Product, ProductUpsertInput } from "@/types";
import {
  normalizeProductTag,
  normalizeProductTranslations,
  resolveLocalizedProduct,
} from "./mappers";

export async function getAllProducts(locale?: Locale): Promise<Product[]> {
  const products = await getProductRepository().getAllProducts();
  return products.map((product) => resolveLocalizedProduct(product, locale));
}

export async function getFeaturedProducts(
  count = 4,
  locale?: Locale,
): Promise<Product[]> {
  const products = await getProductRepository().getFeaturedProducts(count);
  return products.map((product) => resolveLocalizedProduct(product, locale));
}

export async function getProductBySlug(
  slug: string,
  locale?: Locale,
): Promise<Product | null> {
  const product = await getProductRepository().getProductBySlug(slug);
  return product ? resolveLocalizedProduct(product, locale) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  return getProductRepository().getProductById(id);
}

export async function getProductsByTag(
  tag: string,
  locale?: Locale,
): Promise<Product[]> {
  const products = await getAllProducts(locale);
  const normalizedTag = normalizeProductTag(tag);

  return products.filter(
    (product) => normalizeProductTag(product.tag) === normalizedTag,
  );
}

export async function createProduct(input: ProductUpsertInput): Promise<Product> {
  return getProductRepository().createProduct({
    ...input,
    translations: normalizeProductTranslations(input.translations),
  });
}

export async function updateProduct(
  id: number,
  input: ProductUpsertInput,
): Promise<Product> {
  return getProductRepository().updateProduct(id, {
    ...input,
    translations: normalizeProductTranslations(input.translations),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return getProductRepository().deleteProduct(id);
}
