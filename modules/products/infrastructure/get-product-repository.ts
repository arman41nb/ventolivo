import { env } from "@/lib/env";
import type { ProductRepository } from "../domain/contracts";
import { mockProductRepository } from "./mock-product-repository";
import { prismaProductRepository } from "./prisma-product-repository";

export function getProductRepository(): ProductRepository {
  return env.PRODUCTS_DATA_SOURCE === "database" ? prismaProductRepository : mockProductRepository;
}
