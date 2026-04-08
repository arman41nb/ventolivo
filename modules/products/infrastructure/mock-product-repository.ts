import { products as mockProducts } from "@/data/products";
import type { ProductRepository } from "../domain/contracts";
import { normalizeProductTag } from "../domain/mappers";

export const mockProductRepository: ProductRepository = {
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

    return mockProducts.filter((product) => normalizeProductTag(product.tag) === normalizedTag);
  },
  async createProduct() {
    throw new Error("Admin product mutations require PRODUCTS_DATA_SOURCE=database");
  },
  async updateProduct() {
    throw new Error("Admin product mutations require PRODUCTS_DATA_SOURCE=database");
  },
  async deleteProduct() {
    throw new Error("Admin product mutations require PRODUCTS_DATA_SOURCE=database");
  },
};
