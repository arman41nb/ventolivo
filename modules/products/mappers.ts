import { z } from "zod";
import type { Product } from "@/types";

const productIngredientsSchema = z.array(z.string());

const dbProductRecordSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  slug: z.string().min(1),
  tag: z.string().min(1),
  price: z.number().int().nonnegative(),
  color: z.string().min(1),
  description: z.string().min(1),
  ingredients: z.string().nullable(),
  weight: z.string().nullable(),
  featured: z.boolean(),
});

export type DbProductRecord = z.infer<typeof dbProductRecordSchema>;

export function normalizeProductTag(tag: string): string {
  return tag.trim().toLocaleLowerCase();
}

export function parseProductIngredients(
  ingredients: string | null | undefined,
): string[] | undefined {
  if (!ingredients) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(ingredients);
    const result = productIngredientsSchema.safeParse(parsed);

    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function mapDbProductRecord(record: DbProductRecord): Product {
  const product = dbProductRecordSchema.parse(record);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tag: product.tag,
    price: product.price,
    color: product.color,
    description: product.description,
    ingredients: parseProductIngredients(product.ingredients),
    weight: product.weight ?? undefined,
    featured: product.featured,
  };
}
