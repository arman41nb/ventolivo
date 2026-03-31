import type { Product } from "@/types";

export interface ProductRepository {
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(count?: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: number): Promise<Product | null>;
  getProductsByTag(tag: string): Promise<Product[]>;
}
