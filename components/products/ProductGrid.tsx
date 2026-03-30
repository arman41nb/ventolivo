import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  className?: string;
  orderLabel?: string;
}

export default function ProductGrid({
  products,
  className = "",
  orderLabel,
}: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem] ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} orderLabel={orderLabel} />
      ))}
    </div>
  );
}
