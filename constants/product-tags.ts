export const PRODUCT_TAGS = [
  "Detox",
  "Calming",
  "Gentle",
  "Exfoliating",
  "Nourishing",
  "Refreshing",
  "Brightening",
  "Traditional",
] as const;

export type ProductTag = (typeof PRODUCT_TAGS)[number];

export const PRODUCT_TAG_COLORS: Record<ProductTag, string> = {
  Detox: "#4A3728",
  Calming: "#6B7FA0",
  Gentle: "#C5B49A",
  Exfoliating: "#8B7355",
  Nourishing: "#B8868B",
  Refreshing: "#7A9A7E",
  Brightening: "#C9A84C",
  Traditional: "#8B8B3A",
};

export function isValidProductTag(tag: string): tag is ProductTag {
  return (PRODUCT_TAGS as readonly string[]).includes(tag);
}
