export type { ProductRepository } from "./domain/contracts";
export {
  mapDbProductRecord,
  normalizeProductMedia,
  normalizeProductTag,
  normalizeProductTranslations,
  parseLocalizedFieldMap,
  parseProductIngredients,
  resolveLocalizedField,
  resolveLocalizedProduct,
  serializeLocalizedFieldMap,
  serializeProductIngredients,
} from "./domain/mappers";
export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProductsByTag,
  updateProduct,
} from "./application/service";
export { getProductRepository } from "./infrastructure/get-product-repository";
