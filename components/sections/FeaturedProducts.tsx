import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  viewAllLabel?: string;
  orderLabel?: string;
  locale?: Locale;
}

export default function FeaturedProducts({
  products,
  title = "Our Collection",
  viewAllLabel = "View all →",
  orderLabel = "Order via WhatsApp →",
  locale,
}: FeaturedProductsProps) {
  const productsHref = locale ? localePath(locale, "/products") : "/products";

  return (
    <section className="px-[2.5rem] py-[4rem]">
      <div className="flex items-baseline justify-between mb-[2.5rem]">
        <h2 className="font-serif text-[36px] text-dark">{title}</h2>
        <Link
          href={productsHref}
          className="text-[12px] tracking-[1px] text-brown no-underline border-b border-brown hover:text-dark hover:border-dark transition-colors"
        >
          {viewAllLabel}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} orderLabel={orderLabel} />
        ))}
      </div>
    </section>
  );
}
