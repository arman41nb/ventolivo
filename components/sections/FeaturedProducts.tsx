import Link from "next/link";
import ViewportReveal from "@/components/animation/ViewportReveal";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product, StorefrontPreviewBindings } from "@/types";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  viewAllLabel?: string;
  orderLabel?: string;
  locale?: Locale;
  preview?: StorefrontPreviewBindings;
}

export default function FeaturedProducts({
  products,
  title,
  viewAllLabel,
  orderLabel,
  locale,
  preview,
}: FeaturedProductsProps) {
  const productsHref = locale ? localePath(locale, "/products") : "/products";

  return (
    <section className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1380px]">
        <div className="relative overflow-hidden rounded-[34px] border border-brown/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08))] p-6 md:p-8 luxe-panel-float luxe-panel-float-delay-3">
          <span className="pointer-events-none absolute left-[-8%] top-[8%] h-52 w-52 rounded-full bg-white/24 blur-[70px] luxe-atmosphere luxe-atmosphere-delay-1" />
          <span className="pointer-events-none absolute right-[-6%] bottom-[6%] h-44 w-44 rounded-full bg-[#e6d7c4]/28 blur-[72px] luxe-atmosphere luxe-atmosphere-delay-2" />
          <span className="pointer-events-none absolute inset-x-[22%] top-[16%] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.78),rgba(255,255,255,0))] luxe-line-pulse" />
          <span className="ambient-orb right-12 top-6 h-24 w-24 bg-white/28" />
          <span className="ambient-orb bottom-6 left-16 h-16 w-16 bg-olive/12 [animation-delay:1.4s]" />

          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <ViewportReveal className="max-w-[720px]" delay={20} distance={26} duration={520}>
              <h2 className="font-serif text-[2.8rem] leading-[0.98] text-dark md:text-[4.2rem] luxe-heading-glide">
                {preview?.renderEditable({
                  fieldId: "featuredProductsTitle",
                  label: "Featured products title",
                  children: <span>{title}</span>,
                  className: "block w-fit",
                }) ?? title}
              </h2>
            </ViewportReveal>
            <ViewportReveal delay={90} distance={18} duration={460}>
              {viewAllLabel ? (
                preview?.renderEditable({
                  fieldId: "featuredProductsViewAllLabel",
                  label: "Featured view all link",
                  children: (
                    <span className="w-fit border-b border-brown pb-1 text-[14px] text-brown transition-colors hover:text-dark hover:border-dark luxe-link-drift">
                      {viewAllLabel}
                    </span>
                  ),
                  className: "w-fit",
                  badgeAlign: "right",
                }) ?? (
                  <Link
                    href={productsHref}
                    className="w-fit border-b border-brown pb-1 text-[14px] text-brown no-underline transition-colors hover:text-dark hover:border-dark luxe-link-drift"
                  >
                    {viewAllLabel}
                  </Link>
                )
              ) : null}
            </ViewportReveal>
          </div>

          <ViewportReveal delay={120} distance={22} duration={520} className="relative z-10">
            <ProductGrid products={products} orderLabel={orderLabel} locale={locale} />
          </ViewportReveal>
        </div>
      </div>
    </section>
  );
}
