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
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
