import ProductMediaGallery from "@/components/products/ProductMediaGallery";
import type { Product } from "@/types";
import { buildWhatsAppLink, buildProductWhatsAppMessage, formatPrice } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  orderLabel?: string;
}

export default function ProductDetail({
  product,
  orderLabel = "Order via WhatsApp",
}: ProductDetailProps) {
  const message = buildProductWhatsAppMessage(product.name, product.price);
  const whatsappLink = buildWhatsAppLink(message);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.92fr]">
      <ProductMediaGallery items={product.media ?? []} productName={product.name} color={product.color} />
      <div className="animate-rise animate-rise-delay-2 mesh-bg relative overflow-hidden rounded-[34px] border border-brown/8 p-8 shadow-[0_20px_48px_rgba(72,49,30,0.08)] md:p-10">
        <span className="ambient-orb right-10 top-8 h-20 w-20 bg-white/28" />
        <span className="ambient-orb bottom-10 left-8 h-16 w-16 bg-olive/12 [animation-delay:1.4s]" />
        <div className="relative flex flex-col justify-center">
        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-olive">
          <span className="h-2 w-2 rounded-full bg-olive" />
          {product.tag}
        </p>
        <h1 className="font-serif text-[3rem] leading-[0.96] text-dark md:text-[4.5rem]">{product.name}</h1>
        <p className="mb-6 mt-5 text-[15px] leading-[1.9] text-muted">{product.description}</p>
        <div className="mb-6 flex flex-wrap gap-3">
          {product.weight ? (
            <span className="rounded-full border border-brown/10 bg-white/70 px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-brown/76">
              {product.weight}
            </span>
          ) : null}
          <span className="rounded-full border border-brown/10 bg-white/70 px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-brown/76">
            {product.tag}
          </span>
        </div>
        {product.ingredients && product.ingredients.length > 0 ? (
          <div className="mb-7 rounded-[24px] border border-brown/8 bg-white/62 p-5">
            <p className="mb-2 text-[12px] tracking-[0.18em] uppercase text-olive">Ingredients</p>
            <p className="text-[14px] leading-[1.8] text-muted">{product.ingredients.join(", ")}</p>
          </div>
        ) : null}
        <p className="mb-6 font-serif text-[2.6rem] text-brown">{formatPrice(product.price)}</p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-[10px] rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(93,61,39,0.18)] transition-transform hover:-translate-y-0.5 no-underline"
        >
          {orderLabel}
        </a>
        </div>
      </div>
    </div>
  );
}
