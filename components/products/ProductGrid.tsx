import ViewportReveal from "@/components/animation/ViewportReveal";
import ProductCard from "./ProductCard";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  className?: string;
  orderLabel?: string;
  locale?: Locale;
}

export default function ProductGrid({
  products,
  className = "",
  orderLabel,
  locale,
}: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
    >
      {products.map((product, index) => (
        <ViewportReveal
          key={product.id}
          delay={index * 75}
          distance={24}
          duration={500}
        >
          <ProductCard product={product} orderLabel={orderLabel} locale={locale} />
        </ViewportReveal>
      ))}
    </div>
  );
}
