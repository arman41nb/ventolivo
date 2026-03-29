import { products } from "@/data/products";
import type { Product } from "@/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(count = 4): Product[] {
  return products.filter((p) => p.featured).slice(0, count);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter((p) => p.tag.toLowerCase() === tag.toLowerCase());
}
