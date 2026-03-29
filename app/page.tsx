import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import Link from "next/link";

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <Hero />

      {/* Strip */}
      <div className="bg-brown px-[2.5rem] py-[0.8rem] flex gap-[3rem] justify-center">
        {["Handcrafted", "Natural Ingredients", "No Chemicals", "Made in Denizli"].map(
          (item) => (
            <span
              key={item}
              className="text-[11px] tracking-[1.5px] uppercase text-white/[0.8]"
            >
              — {item}
            </span>
          )
        )}
      </div>

      {/* Our Collection */}
      <section className="px-[2.5rem] py-[4rem]">
        <div className="flex items-baseline justify-between mb-[2.5rem]">
          <h2 className="font-serif text-[36px] text-dark">Our Collection</h2>
          <Link
            href="/products"
            className="text-[12px] tracking-[1px] text-brown no-underline border-b border-brown hover:text-dark hover:border-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-warm px-[2.5rem] py-[4rem] grid grid-cols-1 md:grid-cols-2 gap-[4rem] items-center"
      >
        <div className="aspect-[4/3] bg-[#C5B49A] flex items-center justify-center">
          <span className="font-serif text-[18px] text-brown/[0.6]">
            Product photo here
          </span>
        </div>
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[1rem]">
            Our Story
          </p>
          <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[1.5rem]">
            Made by hand,
            <br />
            made with love.
          </h2>
          <p className="text-[14px] leading-[1.9] text-muted mb-[2rem]">
            Every Ventolivo soap is crafted in small batches using cold-process
            methods and the finest natural ingredients. No shortcuts, no
            chemicals — just pure, honest skincare.
          </p>
          <button className="bg-transparent text-brown border border-brown px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-brown hover:text-white transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 border-t border-brown/[0.15] mx-[2.5rem]"
      >
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            ),
            title: "Cold Process",
            text: "Traditional cold-process method preserving all natural glycerin and nutrients.",
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            ),
            title: "Small Batches",
            text: "Each batch is made in small quantities to ensure maximum quality and freshness.",
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            ),
            title: "100% Natural",
            text: "Only plant-based oils, butters, and botanicals. Nothing artificial, ever.",
          },
        ].map((feature, i, arr) => (
          <div
            key={feature.title}
            className={`p-[2.5rem] ${
              i < arr.length - 1 ? "border-r border-brown/[0.15]" : ""
            }`}
          >
            <div className="w-[32px] h-[32px] border border-brown flex items-center justify-center mb-[1rem]">
              {feature.icon}
            </div>
            <p className="font-serif text-[18px] text-dark mb-[0.5rem]">
              {feature.title}
            </p>
            <p className="text-[13px] leading-[1.7] text-muted">{feature.text}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="bg-dark px-[2.5rem] py-[4rem] text-center mt-[3rem]"
      >
        <h2 className="font-serif text-[42px] text-cream mb-[1rem] leading-[1.2]">
          Ready to order?
          <br />
          <em className="italic text-[#C5B49A]">
            We&apos;d love to hear from you.
          </em>
        </h2>
        <p className="text-[13px] text-white/[0.5] mb-[2rem] tracking-[1px]">
          Send us a message and we&apos;ll get back to you within hours
        </p>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[10px] bg-[#25D366] text-white border-none px-[2.2rem] py-[0.9rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-[#20BD5A] transition-colors no-underline"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order on WhatsApp
        </a>
      </section>

      <Footer />
    </>
  );
}
