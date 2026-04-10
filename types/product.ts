import type { Locale } from "@/i18n/config";

export type LocalizedFieldMap = Partial<Record<Locale, string>>;
export type LocalizedListFieldMap = Partial<Record<Locale, string[]>>;

export interface ProductTranslations {
  name?: LocalizedFieldMap;
  tag?: LocalizedFieldMap;
  description?: LocalizedFieldMap;
  weight?: LocalizedFieldMap;
  ingredients?: LocalizedListFieldMap;
}

export interface ProductMediaItem {
  id?: string;
  assetId?: string;
  type: "image" | "video";
  url: string;
  alt?: string;
  thumbnailUrl?: string;
  label?: string;
  role?: "cover" | "gallery" | "video";
  sortOrder?: number;
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
  media?: ProductMediaItem[];
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
  media?: ProductMediaItem[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
