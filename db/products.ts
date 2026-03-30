import { prisma } from "./client";
import type { Product } from "@/types";

export async function dbGetAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapDbProduct);
}

export async function dbGetFeaturedProducts(count = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: count,
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapDbProduct);
}

export async function dbGetProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  return product ? mapDbProduct(product) : null;
}

export async function dbGetProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product ? mapDbProduct(product) : null;
}

export async function dbGetProductsByTag(tag: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { tag },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapDbProduct);
}

interface DbProduct {
  id: number;
  name: string;
  slug: string;
  tag: string;
  price: number;
  color: string;
  description: string;
  ingredients: string | null;
  weight: string | null;
  featured: boolean;
}

function mapDbProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    tag: db.tag,
    price: db.price,
    color: db.color,
    description: db.description,
    ingredients: db.ingredients ? JSON.parse(db.ingredients) : undefined,
    weight: db.weight ?? undefined,
    featured: db.featured,
  };
}
