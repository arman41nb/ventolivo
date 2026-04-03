import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
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
  viewAllLabel = "View all ->",
  orderLabel = "Order via WhatsApp ->",
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
      <ProductGrid products={products} orderLabel={orderLabel} locale={locale} />
    </section>
  );
}
