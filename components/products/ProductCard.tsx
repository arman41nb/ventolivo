/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Product } from "@/types";
import {
  buildWhatsAppLink,
  buildProductWhatsAppMessage,
  formatPrice,
  getPrimaryProductMedia,
} from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  orderLabel?: string;
  locale?: Locale;
}

export default function ProductCard({
  product,
  orderLabel = "Order via WhatsApp ->",
  locale,
}: ProductCardProps) {
  const message = buildProductWhatsAppMessage(product.name, product.price);
  const whatsappLink = buildWhatsAppLink(message);
  const productHref = locale
    ? localePath(locale, `/products/${product.slug}`)
    : `/products/${product.slug}`;
  const media = getPrimaryProductMedia(product);

  return (
    <article
      className="group relative overflow-hidden rounded-[28px] border border-brown/8 bg-[rgba(255,251,246,0.7)] shadow-[0_12px_28px_rgba(72,49,30,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_42px_rgba(72,49,30,0.12)]"
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      <span className="pointer-events-none absolute right-[-12%] top-[-8%] h-32 w-32 rounded-full bg-white/18 blur-[60px] luxe-atmosphere luxe-atmosphere-delay-2" />
      <Link href={productHref} className="block">
        <div className="relative aspect-[0.92] overflow-hidden bg-[linear-gradient(135deg,#ebdfd0,#dac8b2)] about-image-drift">
          <span className="pointer-events-none absolute inset-x-[20%] top-[14%] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.78),rgba(255,255,255,0))] luxe-line-pulse" />
          <span className="pointer-events-none absolute inset-x-[18%] bottom-4 h-12 rounded-full bg-[radial-gradient(circle,rgba(109,77,53,0.18),rgba(109,77,53,0.04)_52%,transparent_78%)] blur-xl transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute right-4 top-4 z-10 rounded-full border border-brown/10 bg-[rgba(255,250,244,0.92)] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[#5d3d27] luxe-badge-float">
            {product.tag}
          </span>
          {media?.type === "image" ? (
            <img
              src={media.url}
              alt={media.alt ?? product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
            />
          ) : media?.type === "video" ? (
            <div className="relative h-full w-full">
              <img
                src={media.thumbnailUrl || media.url}
                alt={media.alt ?? product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-dark/20 text-xs uppercase tracking-[0.16em] text-white">
                Video
              </span>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-[76px] w-[76px] rounded-[12px] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                style={{ backgroundColor: product.color }}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={productHref} className="no-underline">
          <h3 className="font-serif text-[2rem] leading-none text-dark transition-colors group-hover:text-brown">
            {product.name}
          </h3>
        </Link>
        <p className="mt-3 min-h-[72px] text-[14px] leading-[1.8] text-muted">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-[1.1rem] font-bold text-[#5d3d27]">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={productHref}
              className="grid h-11 w-11 place-items-center rounded-full border border-brown/12 bg-white text-brown transition-colors hover:bg-brown hover:text-white no-underline"
              aria-label={`View ${product.name}`}
            >
              <span className="text-lg leading-none">+</span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-brown pb-1 text-[11px] uppercase tracking-[0.14em] text-brown no-underline transition-colors hover:text-dark hover:border-dark"
              aria-label={`${orderLabel} - ${product.name}`}
            >
              {orderLabel}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
