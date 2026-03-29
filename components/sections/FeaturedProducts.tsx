import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="px-[2.5rem] py-[4rem]">
      <div className="flex items-baseline justify-between mb-[2.5rem]">
        <h2 className="font-serif text-[36px] text-dark">Our Collection</h2>
        <Link
          href="/products"
          className="text-[12px] tracking-[1px] text-brown no-underline border-b border-brown hover:text-dark hover:border-dark transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
