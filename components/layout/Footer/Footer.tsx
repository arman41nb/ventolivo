import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="px-[2.5rem] py-[2rem] flex items-center justify-between border-t border-brown/[0.15]">
      <Link href="/" className="font-serif text-[18px] text-brown no-underline">
        {SITE_NAME}
      </Link>
      <p className="text-[12px] text-muted">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </p>
      <div className="flex gap-[1rem]">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[1px] text-muted no-underline uppercase hover:text-brown transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
