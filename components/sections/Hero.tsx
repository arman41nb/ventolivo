/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { SiteContentSettings } from "@/types";

interface HeroProps {
  dict?: Dictionary;
  locale?: Locale;
  siteSettings?: SiteContentSettings;
}

export default function Hero({ dict, locale, siteSettings }: HeroProps) {
  const title = {
    line1: siteSettings?.heroTitleLine1 ?? dict?.hero.title.line1 ?? "Natural soap,",
    line2: siteSettings?.heroTitleLine2 ?? dict?.hero.title.line2 ?? "crafted with",
    line3: siteSettings?.heroTitleLine3 ?? dict?.hero.title.line3 ?? "care.",
  };
  const description =
    siteSettings?.heroDescription ??
    dict?.hero.description ??
    "Handcrafted artisan soaps made with natural oils and botanicals. Each bar is a small act of self-care.";
  const subtitle = siteSettings?.heroSubtitle ?? dict?.hero.subtitle ?? "Soap Atelier - Denizli";
  const shopNow = siteSettings?.heroPrimaryButtonLabel ?? dict?.hero.shopNow ?? "Shop Now";
  const ourStory =
    siteSettings?.heroSecondaryButtonLabel ?? dict?.hero.ourStory ?? "Our Story";
  const badgeValue = siteSettings?.heroBadgeValue ?? dict?.hero.badge.value ?? "100%";
  const badgeLabel = siteSettings?.heroBadgeLabel ?? dict?.hero.badge.label ?? "Natural";

  const productsHref = locale ? localePath(locale, "/products") : "/products";
  const aboutHref = locale ? localePath(locale, "/#about") : "/#about";

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
      <div className="bg-warm px-[3rem] py-[4rem] flex flex-col justify-center">
        <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[1.2rem]">{subtitle}</p>
        <h1 className="font-serif text-[52px] leading-[1.1] text-dark mb-[1.5rem]">
          {title.line1}
          <br />
          <em className="italic text-brown">{title.line2}</em>
          <br />
          {title.line3}
        </h1>
        <p className="text-[14px] leading-[1.8] text-muted mb-[2rem] max-w-[360px]">{description}</p>
        <div className="flex gap-[1rem] items-center">
          <Link
            href={productsHref}
            className="bg-brown text-white border-none px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-dark transition-colors no-underline"
          >
            {shopNow}
          </Link>
          <Link
            href={aboutHref}
            className="bg-transparent text-brown border border-brown px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-brown hover:text-white transition-colors no-underline"
          >
            {ourStory}
          </Link>
        </div>
      </div>
      <div className="bg-[#D4C5B2] flex items-center justify-center relative overflow-hidden">
        {siteSettings?.heroImageUrl ? (
          <img
            src={siteSettings.heroImageUrl}
            alt={siteSettings.heroImageAlt || siteSettings.brandName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative" style={{ width: 200, height: 120 }}>
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
        )}
        <div className="absolute bottom-[2rem] right-[2rem] bg-cream px-[1.2rem] py-[0.8rem] text-center">
          <div className="font-serif text-[28px] text-brown">{badgeValue}</div>
          <div className="text-[10px] tracking-[1px] uppercase text-muted">{badgeLabel}</div>
        </div>
      </div>
    </section>
  );
}
