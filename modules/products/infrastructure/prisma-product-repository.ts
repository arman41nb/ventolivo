import type { ProductRepository } from "../domain/contracts";

export const prismaProductRepository: ProductRepository = {
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
  async createProduct(input) {
    const { dbCreateProduct } = await import("@/db");
    return dbCreateProduct(input);
  },
  async updateProduct(id, input) {
    const { dbUpdateProduct } = await import("@/db");
    return dbUpdateProduct(id, input);
  },
  async deleteProduct(id) {
    const { dbDeleteProduct } = await import("@/db");
    return dbDeleteProduct(id);
  },
};
