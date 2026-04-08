import type { Product, ProductUpsertInput } from "@/types";

export interface ProductRepository {
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(count?: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: number): Promise<Product | null>;
  getProductsByTag(tag: string): Promise<Product[]>;
  createProduct(input: ProductUpsertInput): Promise<Product>;
  updateProduct(id: number, input: ProductUpsertInput): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}
