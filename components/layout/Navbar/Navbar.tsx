/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ViewportReveal from "@/components/animation/ViewportReveal";
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

export default function Navbar({ dict, locale, siteSettings, supportedLocales = [] }: NavbarProps) {
  const prefix = locale ? (p: string) => localePath(locale, p) : (p: string) => p;
  const stripItems = [
    siteSettings?.stripBannerItem1 ?? "Handcrafted",
    siteSettings?.stripBannerItem2 ?? "Natural Ingredients",
    siteSettings?.stripBannerItem3 ?? "No Harsh Chemicals",
    siteSettings?.stripBannerItem4 ?? "Made in Denizli",
  ];

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
    <header className="sticky top-0 z-40">
      <div className="bg-[linear-gradient(180deg,#694733_0%,#5d3d27_100%)] px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.24em] text-cream/88 md:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {stripItems.map((item, index) => (
            <ViewportReveal key={item} as="span" delay={index * 55} distance={12} duration={420}>
              {item}
            </ViewportReveal>
          ))}
        </div>
      </div>

      <nav
        className="border-b border-brown/8 bg-[rgba(249,244,238,0.9)] px-4 py-4 backdrop-blur-xl md:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ViewportReveal delay={40} distance={18} duration={460}>
            <Link
              href={locale ? `/${locale}` : "/"}
              className="font-serif text-[2rem] tracking-[0.06em] text-[#8f735d] no-underline"
              aria-label={`${siteSettings?.brandName ?? "Ventolivo"} - Home`}
            >
              {siteSettings?.logoMode === "image" && siteSettings.logoImageUrl ? (
                <img
                  src={siteSettings.logoImageUrl}
                  alt={siteSettings.logoAltText || siteSettings.brandName}
                  className="h-11 w-auto object-contain"
                />
              ) : (
                (siteSettings?.logoText ?? "Ventolivo")
              )}
            </Link>
          </ViewportReveal>

          <ViewportReveal
            className="flex flex-wrap items-center justify-center gap-4 lg:gap-7"
            role="menubar"
            delay={110}
            distance={18}
            duration={480}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-1 text-[12px] uppercase tracking-[0.2em] text-[#9f8976] no-underline transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown/70 after:transition-all hover:text-brown hover:after:w-full"
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
          </ViewportReveal>

          <ViewportReveal
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-end"
            delay={170}
            distance={18}
            duration={500}
          >
            <LanguageSwitcher locales={supportedLocales} />
            <Link
              href={prefix("/#contact")}
              className="rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(93,61,39,0.16)] transition-transform hover:-translate-y-0.5 no-underline"
              aria-label={siteSettings?.navbarCtaLabel ?? dict?.navbar.cta ?? "Order Now"}
            >
              {siteSettings?.navbarCtaLabel ?? dict?.navbar.cta ?? "Order Now"}
            </Link>
          </ViewportReveal>
        </div>
      </nav>
    </header>
  );
}
