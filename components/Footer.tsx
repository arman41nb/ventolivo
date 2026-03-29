import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-[2.5rem] py-[2rem] flex items-center justify-between border-t border-brown/[0.15]">
      <Link href="/" className="font-serif text-[18px] text-brown no-underline">
        Ventolivo
      </Link>
      <p className="text-[12px] text-muted">
        &copy; 2026 Ventolivo. All rights reserved.
      </p>
      <div className="flex gap-[1rem]">
        <a
          href="#"
          className="text-[11px] tracking-[1px] text-muted no-underline uppercase hover:text-brown transition-colors"
        >
          Instagram
        </a>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[1px] text-muted no-underline uppercase hover:text-brown transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
