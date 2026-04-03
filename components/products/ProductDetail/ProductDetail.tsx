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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[3rem]">
      <ProductMediaGallery items={product.media ?? []} productName={product.name} color={product.color} />
      <div className="flex flex-col justify-center">
        <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[0.8rem]">{product.tag}</p>
        <h1 className="font-serif text-[42px] leading-[1.1] text-dark mb-[1rem]">{product.name}</h1>
        <p className="text-[14px] leading-[1.8] text-muted mb-[1.5rem]">{product.description}</p>
        {product.weight ? <p className="text-[13px] text-muted mb-[0.5rem]">Weight: {product.weight}</p> : null}
        {product.ingredients && product.ingredients.length > 0 ? (
          <div className="mb-[1.5rem]">
            <p className="text-[12px] tracking-[1px] uppercase text-olive mb-[0.5rem]">Ingredients</p>
            <p className="text-[13px] text-muted">{product.ingredients.join(", ")}</p>
          </div>
        ) : null}
        <p className="font-serif text-[28px] text-brown mb-[1.5rem]">{formatPrice(product.price)}</p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[10px] bg-[#25D366] text-white border-none px-[2.2rem] py-[0.9rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-[#20BD5A] transition-colors no-underline w-fit"
        >
          {orderLabel}
        </a>
      </div>
    </div>
  );
}
