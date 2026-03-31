import { env } from "@/lib/env";
import { products as mockProducts } from "@/data/products";
import { type ProductRepository } from "@/modules/products/contracts";
import { normalizeProductTag } from "@/modules/products/mappers";

const mockProductRepository: ProductRepository = {
  async getAllProducts() {
    return mockProducts;
  },
  async getFeaturedProducts(count = 4) {
    return mockProducts.filter((product) => product.featured).slice(0, count);
  },
  async getProductBySlug(slug) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  },
  async getProductById(id) {
    return mockProducts.find((product) => product.id === id) ?? null;
  },
  async getProductsByTag(tag) {
    const normalizedTag = normalizeProductTag(tag);

    return mockProducts.filter(
      (product) => normalizeProductTag(product.tag) === normalizedTag,
    );
  },
};

const prismaProductRepository: ProductRepository = {
  async getAllProducts() {
    const { dbGetAllProducts } = await import("@/db");
    return dbGetAllProducts();
  },
  async getFeaturedProducts(count = 4) {
    const { dbGetFeaturedProducts } = await import("@/db");
    return dbGetFeaturedProducts(count);
  },
  async getProductBySlug(slug) {
    const { dbGetProductBySlug } = await import("@/db");
    return dbGetProductBySlug(slug);
  },
  async getProductById(id) {
    const { dbGetProductById } = await import("@/db");
    return dbGetProductById(id);
  },
  async getProductsByTag(tag) {
    const { dbGetProductsByTag } = await import("@/db");
    return dbGetProductsByTag(tag);
  },
};

export function getProductRepository(): ProductRepository {
  return env.PRODUCTS_DATA_SOURCE === "database"
    ? prismaProductRepository
    : mockProductRepository;
}
