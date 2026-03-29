import type { Product } from "@/types";
import { buildWhatsAppLink, buildProductWhatsAppMessage, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const message = buildProductWhatsAppMessage(product.name, product.price);
  const whatsappLink = buildWhatsAppLink(message);

  return (
    <div className="cursor-pointer group">
      <div className="aspect-square bg-warm mb-[1rem] flex items-center justify-center overflow-hidden relative">
        <div
          className="w-[60px] h-[60px] rounded-[2px] group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: product.color }}
        />
      </div>
      <p className="text-[10px] tracking-[1px] uppercase text-olive mb-[0.3rem]">
        {product.tag}
      </p>
      <p className="font-serif text-[18px] text-dark mb-[0.3rem]">
        {product.name}
      </p>
      <p className="text-[13px] text-muted">{formatPrice(product.price)}</p>
      <div className="mt-[0.5rem]">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[1px] uppercase text-brown no-underline border-b border-brown hover:border-b-2 transition-[border-width]"
        >
          Order via WhatsApp →
        </a>
      </div>
    </div>
  );
}
