import Link from "next/link";
import { siteConfig, socialLinks } from "@/config";
import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface FooterProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

export default function Footer({ dict, siteSettings }: FooterProps) {
  const brandName = siteSettings?.brandName ?? siteConfig.name;
  const copyright =
    siteSettings?.footerCopyrightText ?? dict?.footer.copyright ?? "All rights reserved.";

  return (
    <footer
      className="px-[2.5rem] py-[2rem] flex items-center justify-between border-t border-brown/[0.15]"
      role="contentinfo"
    >
      <Link href="/" className="font-serif text-[18px] text-brown no-underline" aria-label={brandName}>
        {brandName}
      </Link>
      <p className="text-[12px] text-muted">
        &copy; {new Date().getFullYear()} {brandName}. {copyright}
      </p>
      <nav className="flex gap-[1rem]" aria-label="Social links">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[1px] text-muted no-underline uppercase hover:text-brown transition-colors"
            aria-label={`${link.label} (opens in new tab)`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
