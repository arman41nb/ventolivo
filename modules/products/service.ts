import { getProductRepository } from "@/repositories/products";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  return getProductRepository().getAllProducts();
}

export async function getFeaturedProducts(count = 4): Promise<Product[]> {
  return getProductRepository().getFeaturedProducts(count);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getProductRepository().getProductBySlug(slug);
}

export async function getProductById(id: number): Promise<Product | null> {
  return getProductRepository().getProductById(id);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  return getProductRepository().getProductsByTag(tag);
}
