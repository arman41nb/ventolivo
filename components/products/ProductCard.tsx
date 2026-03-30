import type { Product } from "@/types";
import { buildWhatsAppLink, buildProductWhatsAppMessage, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  orderLabel?: string;
}

export default function ProductCard({ product, orderLabel = "Order via WhatsApp →" }: ProductCardProps) {
  const message = buildProductWhatsAppMessage(product.name, product.price);
  const whatsappLink = buildWhatsAppLink(message);

  return (
    <article className="cursor-pointer group" aria-label={`${product.name} - ${formatPrice(product.price)}`}>
      <div className="aspect-square bg-warm mb-[1rem] flex items-center justify-center overflow-hidden relative">
        <div
          className="w-[60px] h-[60px] rounded-[2px] group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: product.color }}
          role="img"
          aria-label={`${product.name} soap color swatch`}
        />
      </div>
      <p className="text-[10px] tracking-[1px] uppercase text-olive mb-[0.3rem]">
        {product.tag}
      </p>
      <h3 className="font-serif text-[18px] text-dark mb-[0.3rem]">
        {product.name}
      </h3>
      <p className="text-[13px] text-muted" aria-label={`Price: ${formatPrice(product.price)}`}>
        {formatPrice(product.price)}
      </p>
      <div className="mt-[0.5rem]">
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
