/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { SiteContentSettings, SiteLocaleConfig } from "@/types";

interface NavbarProps {
  dict?: Dictionary;
  locale?: Locale;
  siteSettings?: SiteContentSettings;
  supportedLocales?: SiteLocaleConfig[];
}

export default function Navbar({
  dict,
  locale,
  siteSettings,
  supportedLocales = [],
}: NavbarProps) {
  const prefix = locale ? (p: string) => localePath(locale, p) : (p: string) => p;

  const navLinks = dict
    ? [
        {
          label: siteSettings?.navbarLinkProducts ?? dict.navbar.links.products,
          href: prefix("/products"),
        },
        {
          label: siteSettings?.navbarLinkAbout ?? dict.navbar.links.about,
          href: prefix("/#about"),
        },
        {
          label: siteSettings?.navbarLinkContact ?? dict.navbar.links.contact,
          href: prefix("/#contact"),
        },
      ]
    : [
        { label: "Products", href: "/products" },
        { label: "About", href: "/#about" },
        { label: "Contact", href: "/#contact" },
      ];

  return (
    <nav
      className="flex items-center justify-between px-[2.5rem] py-[1.2rem] bg-cream border-b border-brown/[0.15] sticky top-0 z-10"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href={locale ? `/${locale}` : "/"}
        className="font-serif text-[22px] font-medium tracking-[2px] text-brown no-underline"
        aria-label={`${siteSettings?.brandName ?? "Ventolivo"} - Home`}
      >
        {siteSettings?.logoMode === "image" && siteSettings.logoImageUrl ? (
          <img
            src={siteSettings.logoImageUrl}
            alt={siteSettings.logoAltText || siteSettings.brandName}
            className="h-10 w-auto object-contain"
          />
        ) : (
          siteSettings?.logoText ?? (
            <>
              Vento<span className="italic">livo</span>
            </>
          )
        )}
      </Link>
      <div className="flex gap-[2rem] items-center" role="menubar">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[12px] tracking-[1.5px] uppercase text-muted no-underline hover:text-brown transition-colors"
            role="menuitem"
          >
            {link.label}
          </Link>
        ))}
        <LanguageSwitcher locales={supportedLocales} />
      </div>
      <Link
        href={prefix("/#contact")}
        className="bg-brown text-white border-none px-[1.4rem] py-[0.6rem] font-sans text-[12px] tracking-[1px] cursor-pointer hover:bg-dark transition-colors no-underline"
        aria-label={siteSettings?.navbarCtaLabel ?? dict?.navbar.cta ?? "Order Now"}
      >
        {siteSettings?.navbarCtaLabel ?? dict?.navbar.cta ?? "Order Now"}
      </Link>
    </nav>
  );
}
