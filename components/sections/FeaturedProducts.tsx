import Link from "next/link";
import ViewportReveal from "@/components/animation/ViewportReveal";
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
    <section className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1380px]">
        <div className="relative overflow-hidden rounded-[34px] border border-brown/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08))] p-6 md:p-8">
          <span className="ambient-orb right-12 top-6 h-24 w-24 bg-white/28" />
          <span className="ambient-orb bottom-6 left-16 h-16 w-16 bg-olive/12 [animation-delay:1.4s]" />

          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <ViewportReveal
              className="max-w-[720px]"
              delay={20}
              distance={26}
              duration={520}
            >
              <h2 className="font-serif text-[2.8rem] leading-[0.98] text-dark md:text-[4.2rem]">
                {title}
              </h2>
            </ViewportReveal>
            <ViewportReveal delay={90} distance={18} duration={460}>
              <Link
                href={productsHref}
                className="w-fit border-b border-brown pb-1 text-[14px] text-brown no-underline transition-colors hover:text-dark hover:border-dark"
              >
                {viewAllLabel}
              </Link>
            </ViewportReveal>
          </div>

          <ViewportReveal delay={120} distance={22} duration={520}>
            <ProductGrid products={products} orderLabel={orderLabel} locale={locale} />
          </ViewportReveal>
        </div>
      </div>
    </section>
  );
}
