import Link from "next/link";
import { siteConfig, socialLinks } from "@/config";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { SiteContentSettings } from "@/types";

interface FooterProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
  locale?: Locale;
}

export default function Footer({ dict, siteSettings, locale }: FooterProps) {
  const brandName = siteSettings?.brandName ?? siteConfig.name;
  const copyright =
    siteSettings?.footerCopyrightText ?? dict?.footer.copyright ?? "All rights reserved.";
  const homeHref = locale ? `/${locale}` : "/";
  const productLabel = dict?.navbar.links.products ?? "Products";
  const aboutLabel = dict?.navbar.links.about ?? "About";
  const contactLabel = dict?.navbar.links.contact ?? "Contact";
  const featureLabels = [
    productLabel,
    dict?.about.subtitle ?? aboutLabel,
    dict?.cta.button ?? contactLabel,
  ];

  return (
    <footer
      className="mt-8 bg-[linear-gradient(180deg,rgba(93,61,39,0.96),rgba(72,46,28,1))] px-4 py-10 text-cream md:px-6"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <Link
              href={homeHref}
              className="font-serif text-[2.4rem] text-cream no-underline"
              aria-label={brandName}
            >
              {brandName}
            </Link>
            <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-cream/75">
              {siteSettings?.heroDescription ?? siteConfig.description}
            </p>
          </div>

          <div>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">{productLabel}</h5>
            <div className="grid gap-2 text-[14px] text-cream/75">
              <Link href={locale ? `/${locale}/products` : "/products"} className="no-underline hover:text-white">
                {productLabel}
              </Link>
              <Link href={`${homeHref}#about`} className="no-underline hover:text-white">
                {aboutLabel}
              </Link>
              <Link href={`${homeHref}#contact`} className="no-underline hover:text-white">
                {contactLabel}
              </Link>
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">{aboutLabel}</h5>
            <div className="grid gap-2 text-[14px] text-cream/75">
              {featureLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
              Social
            </h5>
            <nav className="grid gap-2 text-[14px] text-cream/75" aria-label="Social links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:text-white"
                  aria-label={`${link.label} (opens in new tab)`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-cream/65">
          <p>
            &copy; {new Date().getFullYear()} {brandName}. {copyright}
          </p>
          <p>Designed for a premium handmade care brand.</p>
        </div>
      </div>
    </footer>
  );
}
