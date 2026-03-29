import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-[2.5rem] py-[1.2rem] bg-cream border-b border-brown/[0.15] sticky top-0 z-10">
      <Link
        href="/"
        className="font-serif text-[22px] font-medium tracking-[2px] text-brown no-underline"
      >
        Vento<span className="italic">livo</span>
      </Link>
      <div className="flex gap-[2rem]">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[12px] tracking-[1.5px] uppercase text-muted no-underline hover:text-brown transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="bg-brown text-white border-none px-[1.4rem] py-[0.6rem] font-sans text-[12px] tracking-[1px] cursor-pointer hover:bg-dark transition-colors no-underline"
      >
        Order Now
      </Link>
    </nav>
  );
}
