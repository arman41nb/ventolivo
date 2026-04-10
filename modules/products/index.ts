export type { ProductRepository } from "./domain/contracts";
export {
  mapDbProductRecord,
  normalizeProductMedia,
  normalizeProductTag,
  normalizeProductTranslations,
  parseLocalizedFieldMap,
  parseLocalizedListFieldMap,
  parseProductIngredients,
  resolveLocalizedField,
  resolveLocalizedListField,
  resolveLocalizedProduct,
  serializeLocalizedFieldMap,
  serializeLocalizedListFieldMap,
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
