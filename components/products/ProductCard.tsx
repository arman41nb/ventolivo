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
  const productHref = locale ? localePath(locale, `/products/${product.slug}`) : `/products/${product.slug}`;
  const media = getPrimaryProductMedia(product);

  return (
    <article className="group flex flex-col" aria-label={`${product.name} - ${formatPrice(product.price)}`}>
      <Link href={productHref} className="block">
        <div className="relative mb-[1rem] aspect-square overflow-hidden bg-warm">
          {media?.type === "image" ? (
            <img
              src={media.url}
              alt={media.alt ?? product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : media?.type === "video" ? (
            <div className="relative h-full w-full">
              <img
                src={media.thumbnailUrl || media.url}
                alt={media.alt ?? product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-dark/20 text-xs uppercase tracking-[0.16em] text-white">
                Video
              </span>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-[60px] w-[60px] rounded-[2px] transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: product.color }}
              />
            </div>
          )}
        </div>
      </Link>
      <p className="mb-[0.3rem] text-[10px] tracking-[1px] uppercase text-olive">{product.tag}</p>
      <Link href={productHref} className="no-underline">
        <h3 className="mb-[0.3rem] font-serif text-[18px] text-dark transition-colors group-hover:text-brown">
          {product.name}
        </h3>
      </Link>
      <p className="text-[13px] text-muted">{formatPrice(product.price)}</p>
      <div className="mt-[0.6rem] flex items-center justify-between gap-4">
        <Link
          href={productHref}
          className="text-[11px] tracking-[1px] uppercase text-muted no-underline hover:text-dark"
        >
          View product
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[1px] uppercase text-brown no-underline border-b border-brown hover:border-b-2 transition-[border-width]"
          aria-label={`${orderLabel} - ${product.name}`}
        >
          {orderLabel}
        </a>
      </div>
    </article>
  );
}
