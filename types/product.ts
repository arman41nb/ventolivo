import type { Locale } from "@/i18n/config";

export type LocalizedFieldMap = Partial<Record<Locale, string>>;

export interface ProductTranslations {
  name?: LocalizedFieldMap;
  tag?: LocalizedFieldMap;
  description?: LocalizedFieldMap;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tag: string;
  price: number;
  color: string;
  description: string;
  ingredients?: string[];
  weight?: string;
  featured?: boolean;
  translations?: ProductTranslations;
}

export interface ProductUpsertInput {
  name: string;
  slug: string;
  tag: string;
  price: number;
  color: string;
  description: string;
  ingredients?: string[];
  weight?: string;
  featured?: boolean;
  translations?: ProductTranslations;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
