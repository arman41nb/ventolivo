"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ViewportReveal from "@/components/animation/ViewportReveal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { cn } from "@/lib/utils";
import type { StorefrontContent } from "@/modules/site-content";
import type { SiteLocaleConfig, StorefrontPreviewBindings } from "@/types";

interface NavbarProps {
  locale: Locale;
  brand: {
    name: string;
    logoMode: "text" | "image";
    logoText: string;
    logoImageUrl?: string;
    logoAltText?: string;
  };
  content: StorefrontContent["navbar"];
  supportedLocales: SiteLocaleConfig[];
  preview?: StorefrontPreviewBindings;
}

function renderEditable(
  preview: StorefrontPreviewBindings | undefined,
  fieldId: Parameters<StorefrontPreviewBindings["renderEditable"]>[0]["fieldId"],
  label: string,
  children: ReactNode,
  className = "",
  badgeAlign: "left" | "right" = "left",
) {
  if (!preview) {
    return children;
  }

  return preview.renderEditable({ fieldId, label, children, className, badgeAlign });
}

export default function Navbar({
  locale,
  brand,
  content,
  supportedLocales,
  preview,
}: NavbarProps) {
  const isPreview = Boolean(preview);
  const pathname = usePathname();
  const [mobileMenuState, setMobileMenuState] = useState({ pathname, open: false });
  const prefix = (path: string) => localePath(locale, path);
  const isMobileMenuOpen =
    mobileMenuState.pathname === pathname ? mobileMenuState.open : false;
  const navLinks = [
    { fieldId: "navbarLinkProducts" as const, label: content.links.products, href: prefix("/products") },
    { fieldId: "navbarLinkAbout" as const, label: content.links.about, href: prefix("/#about") },
    { fieldId: "navbarLinkContact" as const, label: content.links.contact, href: prefix("/#contact") },
  ];

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuState((current) => (current.open ? { pathname, open: false } : current));
      }
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, [pathname]);

  return (
    <header className={isPreview ? "relative z-10" : "sticky top-0 z-40"}>
      <div className="bg-[linear-gradient(180deg,#694733_0%,#5d3d27_100%)] px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.24em] text-cream/88 md:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {content.stripItems.map((item, index) => (
            <ViewportReveal key={item} as="span" delay={index * 55} distance={12} duration={420}>
              {renderEditable(
                preview,
                (`stripBannerItem${index + 1}` as "stripBannerItem1" | "stripBannerItem2" | "stripBannerItem3" | "stripBannerItem4"),
                `Strip item ${index + 1}`,
                <span>{item}</span>,
                "w-fit",
              )}
            </ViewportReveal>
          ))}
        </div>
      </div>

      <nav
        className="border-b border-brown/8 bg-[rgba(249,244,238,0.9)] px-4 py-3.5 backdrop-blur-xl md:px-6 md:py-4"
        role="navigation"
        aria-label={brand.name}
      >
        <div className="mx-auto max-w-[1380px]">
          <div className="flex items-center justify-between gap-4 lg:hidden">
            {preview ? (
              renderEditable(
                preview,
                brand.logoMode === "image" && brand.logoImageUrl ? "logoImage" : "logoText",
                brand.logoMode === "image" && brand.logoImageUrl ? "Logo image" : "Logo text",
                brand.logoMode === "image" && brand.logoImageUrl ? (
                  <img
                    src={brand.logoImageUrl}
                    alt={brand.logoAltText || brand.name}
                    className="h-11 w-auto object-contain"
                  />
                ) : (
                  <span className="font-serif text-[2rem] tracking-[0.06em] text-[#8f735d]">
                    {brand.logoText}
                  </span>
                ),
                "inline-flex w-fit items-center",
              )
            ) : (
              <Link
                href={`/${locale}`}
                className="font-serif text-[2rem] tracking-[0.06em] text-[#8f735d] no-underline"
                aria-label={brand.name}
              >
                {brand.logoMode === "image" && brand.logoImageUrl ? (
                  <img
                    src={brand.logoImageUrl}
                    alt={brand.logoAltText || brand.name}
                    className="h-11 w-auto object-contain"
                  />
                ) : (
                  brand.logoText
                )}
              </Link>
            )}

            <div className="flex items-center gap-2">
              <LanguageSwitcher locales={supportedLocales} />
              <button
                type="button"
                onClick={() =>
                  setMobileMenuState((current) => ({
                    pathname,
                    open: current.pathname === pathname ? !current.open : true,
                  }))
                }
                className="grid h-12 w-12 place-items-center rounded-full border border-brown/8 bg-white/84 text-[#8f735d] shadow-[0_10px_22px_rgba(72,49,30,0.05)] transition-colors hover:bg-white"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
                <span className="flex h-4 w-5 flex-col justify-between">
                  <span
                    className={cn(
                      "block h-0.5 rounded-full bg-current transition-transform duration-300",
                      isMobileMenuOpen && "translate-y-[7px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 rounded-full bg-current transition-opacity duration-300",
                      isMobileMenuOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 rounded-full bg-current transition-transform duration-300",
                      isMobileMenuOpen && "-translate-y-[7px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>

          <div
            id="mobile-navigation-menu"
            className={cn(
              "overflow-hidden transition-all duration-300 lg:hidden",
              isMobileMenuOpen ? "mt-4 max-h-[420px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(242,233,224,0.9))] p-4 shadow-[0_18px_38px_rgba(72,49,30,0.08)]">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <span key={link.href}>
                    {renderEditable(
                      preview,
                      link.fieldId,
                      "Mobile nav link",
                      <span className="rounded-[20px] border border-brown/6 bg-white/58 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[#7e6652] transition-colors hover:bg-white hover:text-brown">
                        {link.label}
                      </span>,
                      "block w-full",
                    )}
                  </span>
                ))}
              </div>
              {renderEditable(
                preview,
                "navbarCtaLabel",
                "Header CTA",
                <span className="mt-4 inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(93,61,39,0.16)] transition-transform hover:-translate-y-0.5">
                  {content.ctaLabel}
                </span>,
                "block w-full",
              )}
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-6">
            <ViewportReveal delay={40} distance={18} duration={460}>
              {preview ? (
                renderEditable(
                  preview,
                  brand.logoMode === "image" && brand.logoImageUrl ? "logoImage" : "logoText",
                  brand.logoMode === "image" && brand.logoImageUrl ? "Logo image" : "Logo text",
                  brand.logoMode === "image" && brand.logoImageUrl ? (
                    <img
                      src={brand.logoImageUrl}
                      alt={brand.logoAltText || brand.name}
                      className="h-11 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-serif text-[2rem] tracking-[0.06em] text-[#8f735d]">
                      {brand.logoText}
                    </span>
                  ),
                  "inline-flex w-fit items-center",
                )
              ) : (
                <Link
                  href={`/${locale}`}
                  className="font-serif text-[2rem] tracking-[0.06em] text-[#8f735d] no-underline"
                  aria-label={brand.name}
                >
                  {brand.logoMode === "image" && brand.logoImageUrl ? (
                    <img
                      src={brand.logoImageUrl}
                      alt={brand.logoAltText || brand.name}
                      className="h-11 w-auto object-contain"
                    />
                  ) : (
                    brand.logoText
                  )}
                </Link>
              )}
            </ViewportReveal>

            <ViewportReveal
              className="flex flex-wrap items-center justify-center gap-4 xl:gap-7"
              role="menubar"
              delay={110}
              distance={18}
              duration={480}
            >
              {navLinks.map((link) => (
                <span key={link.href} role="menuitem">
                  {renderEditable(
                    preview,
                    link.fieldId,
                    "Header link",
                    <span className="relative pb-1 text-[12px] uppercase tracking-[0.2em] text-[#9f8976] transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown/70 after:transition-all hover:text-brown hover:after:w-full">
                      {link.label}
                    </span>,
                    "w-fit",
                  )}
                </span>
              ))}
            </ViewportReveal>

            <ViewportReveal
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-end"
              delay={170}
              distance={18}
              duration={500}
            >
              <LanguageSwitcher locales={supportedLocales} />
              {renderEditable(
                preview,
                "navbarCtaLabel",
                "Header CTA",
                <span className="rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(93,61,39,0.16)] transition-transform hover:-translate-y-0.5">
                  {content.ctaLabel}
                </span>,
                "w-fit",
                "right",
              )}
            </ViewportReveal>
          </div>
        </div>
      </nav>
    </header>
  );
}
