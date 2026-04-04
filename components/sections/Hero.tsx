"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      setScrollY(window.scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fallbackHeroImage =
    "/uploads/media/1775316749688-6ecaa607-e084-4337-91d8-84fe7c998834-natural-yogurt-soap-from-ventolivo-removebg-preview.png";
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
  const brandName = siteSettings?.brandName ?? "Ventolivo";
  const naturalTitle = siteSettings?.feature3Title ?? dict?.features.items.natural.title ?? "Natural";
  const naturalText = siteSettings?.feature3Text ?? dict?.features.items.natural.text ?? "Only plant-based oils, butters, and botanicals.";
  const batchTitle =
    siteSettings?.feature2Title ?? dict?.features.items.smallBatches.title ?? "Small Batches";
  const processTitle =
    siteSettings?.feature1Title ?? dict?.features.items.coldProcess.title ?? "Cold Process";
  const processText =
    siteSettings?.feature1Text ??
    dict?.features.items.coldProcess.text ??
    "Traditional craft that preserves the character of each ingredient.";
  const trustPills = [naturalTitle, batchTitle, processTitle];
  const heroImageUrl = siteSettings?.heroImageUrl || fallbackHeroImage;
  const heroImageAlt = siteSettings?.heroImageAlt || `${brandName} hero product`;
  const scrollProgress = Math.max(0, Math.min(scrollY / 720, 1));
  const imageTransform = `translate3d(${scrollProgress * 8 - 22}px, ${scrollProgress * 14 - 138}px, 0) rotate(${scrollProgress * 2.4 - 4.3}deg) scale(${1.14 + scrollProgress * 0.025})`;
  const stageTransform = `translate3d(${scrollProgress * 7}px, ${scrollProgress * -4}px, 0)`;
  const processCardTransform = `translate3d(${scrollProgress * -3}px, ${scrollProgress * 8}px, 0)`;
  const naturalCardTransform = `translate3d(${scrollProgress * -2}px, ${scrollProgress * -6}px, 0)`;
  const glowTransform = `translate3d(${scrollProgress * -10}px, ${scrollProgress * 12}px, 0) scale(${1 + scrollProgress * 0.04})`;
  const shadowTransform = `translate3d(${scrollProgress * 8}px, ${scrollProgress * 12}px, 0) scale(${1 + scrollProgress * 0.03})`;
  const insightCards = [
    {
      key: "process",
      eyebrow: processTitle,
      title: processTitle,
      text: processText,
      transform: processCardTransform,
    },
    {
      key: "natural",
      eyebrow: `${badgeValue} ${badgeLabel}`,
      title: naturalTitle,
      text: naturalText,
      transform: naturalCardTransform,
    },
  ];

  const productsHref = locale ? localePath(locale, "/products") : "/products";
  const aboutHref = locale ? localePath(locale, "/#about") : "/#about";

  return (
    <section className="px-4 pb-5 pt-4 md:px-6 md:pt-5">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[42px] border border-white/55 bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(244,236,228,0.94))] shadow-[0_28px_90px_rgba(109,82,58,0.14)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.95),transparent_20%),radial-gradient(circle_at_82%_15%,rgba(255,255,255,0.7),transparent_16%),radial-gradient(circle_at_50%_88%,rgba(198,178,156,0.2),transparent_22%)]" />
        <span className="ambient-orb left-10 top-10 h-28 w-28 bg-white/52" />
        <span className="ambient-orb bottom-10 left-[48%] h-24 w-24 bg-[#d9c4a7]/20 [animation-delay:1.2s]" />
        <span className="ambient-orb right-16 top-16 h-24 w-24 bg-white/34 [animation-delay:2s]" />

        <div className="relative grid gap-10 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(560px,1.18fr)] lg:items-center lg:gap-2 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
          <div className="relative z-10 flex flex-col justify-center lg:pe-6">
            <div className="animate-rise flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center gap-3 rounded-full border border-brown/8 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#9c826a] shadow-[0_10px_25px_rgba(72,49,30,0.05)]">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                {subtitle}
              </p>
              <span className="rounded-full border border-brown/8 bg-white/74 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#9c826a]">
                {badgeValue} {badgeLabel}
              </span>
            </div>

            <div className="mt-6 max-w-[620px]">
              <h1 className="animate-rise animate-rise-delay-1 font-serif text-[3.55rem] leading-[0.88] tracking-[-0.03em] text-[#3f2c1f] md:text-[5.1rem] xl:text-[6.3rem]">
                <span className="block">{title.line1}</span>
                <span className="mt-1 block text-[#a07d62]">
                  <em className="font-medium italic">{title.line2}</em>
                </span>
                <span className="block">{title.line3}</span>
              </h1>
              <p className="animate-rise animate-rise-delay-2 mt-8 max-w-[430px] text-[15px] leading-[1.9] text-[#6f5a49] md:text-[17px]">
                {description}
              </p>
            </div>

            <div className="animate-rise animate-rise-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={productsHref}
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(93,61,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(93,61,39,0.24)] no-underline"
              >
                {shopNow}
              </Link>
              <Link
                href={aboutHref}
                className="inline-flex items-center justify-center rounded-full border border-brown/8 bg-white/84 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-[#8a6b52] shadow-[0_10px_24px_rgba(72,49,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white no-underline"
              >
                {ourStory}
              </Link>
            </div>

            <div className="animate-rise animate-rise-delay-4 mt-8 flex flex-wrap gap-3">
              {trustPills.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-brown/8 bg-white/74 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#a18a75] shadow-[0_8px_22px_rgba(72,49,30,0.04)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[460px] lg:min-h-[640px]">
            <div className="grid h-full min-h-[460px] gap-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-stretch lg:min-h-[640px] lg:gap-7">
              <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[640px]">
                <div
                  className="absolute inset-x-[6%] top-[11%] bottom-[13%] rounded-[46px] border border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(246,237,228,0.28))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_32px_62px_rgba(109,82,58,0.08)] transition-transform duration-300"
                  style={{ transform: stageTransform }}
                />
                <div
                  className="absolute left-[10%] top-[11%] h-[52%] w-[76%] rounded-[999px] bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.98),rgba(255,255,255,0.76)_34%,rgba(239,228,217,0.28)_66%,transparent_84%)] transition-transform duration-300"
                  style={{ transform: glowTransform }}
                />
                <div
                  className="absolute left-[18%] bottom-[16%] h-16 w-[60%] rounded-full bg-[radial-gradient(circle,rgba(109,77,53,0.28),rgba(109,77,53,0.08)_42%,transparent_74%)] blur-2xl transition-transform duration-300"
                  style={{ transform: shadowTransform }}
                />
                <div
                  className="animate-rise animate-rise-delay-2 absolute left-[-4%] top-[-8%] z-20 w-[104%] max-w-[900px] transition-transform duration-300"
                  style={{ transform: imageTransform }}
                >
                  <img
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    className="hero-product-reveal w-full object-contain drop-shadow-[0_38px_54px_rgba(78,54,37,0.26)]"
                  />
                </div>
              </div>

              <div className="relative z-30 flex flex-col justify-center gap-5 pb-[14%] pt-[18%] sm:py-[16%] lg:py-[18%]">
                {insightCards.map((card, index) => (
                  <div
                    key={card.key}
                    className={`animate-rise ${
                      index === 0 ? "animate-rise-delay-3" : "animate-rise-delay-4"
                    } rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,246,0.94),rgba(248,243,237,0.82))] p-5 shadow-[0_22px_45px_rgba(105,81,61,0.08)] backdrop-blur-xl transition-transform duration-300`}
                    style={{ transform: card.transform }}
                  >
                    <small className="block text-[11px] uppercase tracking-[0.18em] text-[#c2a78f]">
                      {card.eyebrow}
                    </small>
                    <strong className="mt-3 block font-serif text-[2rem] leading-none text-[#96755d]">
                      {card.title}
                    </strong>
                    <p className="mt-4 text-[13px] leading-[1.95] text-[#806b59]">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-rise animate-rise-delay-3 absolute left-[10%] top-[7%] z-30 rounded-full border border-white/62 bg-[rgba(255,252,247,0.88)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#ab8a72] shadow-[0_14px_28px_rgba(105,81,61,0.06)] backdrop-blur-xl">
              {brandName}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
