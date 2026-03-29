import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
      <div className="bg-warm px-[3rem] py-[4rem] flex flex-col justify-center">
        <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[1.2rem]">
          Sabun Atölyesi — Denizli
        </p>
        <h1 className="font-serif text-[52px] leading-[1.1] text-dark mb-[1.5rem]">
          Natural soap,
          <br />
          <em className="italic text-brown">crafted with</em>
          <br />
          care.
        </h1>
        <p className="text-[14px] leading-[1.8] text-muted mb-[2rem] max-w-[360px]">
          Handcrafted artisan soaps made with natural oils and botanicals. Each
          bar is a small act of self-care.
        </p>
        <div className="flex gap-[1rem] items-center">
          <Link
            href="/products"
            className="bg-brown text-white border-none px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-dark transition-colors no-underline"
          >
            Shop Now
          </Link>
          <Link
            href="/#about"
            className="bg-transparent text-brown border border-brown px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-brown hover:text-white transition-colors no-underline"
          >
            Our Story
          </Link>
        </div>
      </div>
      <div className="bg-[#D4C5B2] flex items-center justify-center relative overflow-hidden">
        <div
          className="relative"
          style={{ width: 200, height: 120 }}
        >
          <div
            className="absolute w-[70px] h-[70px] bg-brown/[0.7] rounded-[2px]"
            style={{ top: -20, left: 0, transform: "rotate(-8deg)" }}
          />
          <div
            className="absolute w-[70px] h-[70px] bg-[#8B7355] rounded-[2px]"
            style={{ top: 25, left: 50 }}
          />
          <div
            className="absolute w-[70px] h-[70px] bg-[#C5B49A] rounded-[2px]"
            style={{ top: -5, left: 100, transform: "rotate(5deg)" }}
          />
        </div>
        <div className="absolute bottom-[2rem] right-[2rem] bg-cream px-[1.2rem] py-[0.8rem] text-center">
          <div className="font-serif text-[28px] text-brown">100%</div>
          <div className="text-[10px] tracking-[1px] uppercase text-muted">
            Natural
          </div>
        </div>
      </div>
    </section>
  );
}
