"use client";
import { useEffect, type CSSProperties, useState } from "react";
import Link from "next/link";
import HeroVisualStage from "@/components/sections/HeroVisualStage";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getHeroSceneMediaState, getHeroSceneTransforms } from "@/modules/site-content";
import type { SiteContentSettings } from "@/types";

interface HeroProps {
  dict?: Dictionary;
  locale?: Locale;
  siteSettings?: SiteContentSettings;
}

function animationStyle(delay: number, duration?: number): CSSProperties {
  return {
    animationDelay: `${delay}ms`,
    ...(duration ? { animationDuration: `${duration}ms` } : {}),
  };
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
  const ourStory = siteSettings?.heroSecondaryButtonLabel ?? dict?.hero.ourStory ?? "Our Story";
  const badgeValue = siteSettings?.heroBadgeValue ?? dict?.hero.badge.value ?? "100%";
  const badgeLabel = siteSettings?.heroBadgeLabel ?? dict?.hero.badge.label ?? "Natural";
  const brandName = siteSettings?.brandName ?? "Ventolivo";
  const naturalTitle =
    siteSettings?.feature3Title ?? dict?.features.items.natural.title ?? "Natural";
  const naturalText =
    siteSettings?.feature3Text ??
    dict?.features.items.natural.text ??
    "Only plant-based oils, butters, and botanicals.";
  const batchTitle =
    siteSettings?.feature2Title ?? dict?.features.items.smallBatches.title ?? "Small Batches";
  const processTitle =
    siteSettings?.feature1Title ?? dict?.features.items.coldProcess.title ?? "Cold Process";
  const processText =
    siteSettings?.feature1Text ??
    dict?.features.items.coldProcess.text ??
    "Traditional craft that preserves the character of each ingredient.";
  const trustPills = [naturalTitle, batchTitle, processTitle];
  const heroMedia = getHeroSceneMediaState(siteSettings, brandName);
  const heroScene = getHeroSceneTransforms(scrollY / 720, heroMedia);
  const insightCards = [
    {
      key: "process",
      eyebrow: processTitle,
      title: processTitle,
      text: processText,
      transform: heroScene.processCardTransform,
      toneClass: "bg-[linear-gradient(180deg,rgba(255,251,246,0.96),rgba(248,243,237,0.84))]",
    },
    {
      key: "natural",
      eyebrow: `${badgeValue} ${badgeLabel}`,
      title: naturalTitle,
      text: naturalText,
      transform: heroScene.naturalCardTransform,
      toneClass: "bg-[linear-gradient(180deg,rgba(255,248,246,0.96),rgba(247,239,235,0.86))]",
    },
  ];

  const productsHref = locale ? localePath(locale, "/products") : "/products";
  const aboutHref = locale ? localePath(locale, "/#about") : "/#about";

  return (
    <section className="px-4 pb-5 pt-4 md:px-6 md:pt-5">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[42px] border border-white/55 bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(244,236,228,0.94))] shadow-[0_28px_90px_rgba(109,82,58,0.14)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.95),transparent_20%),radial-gradient(circle_at_82%_15%,rgba(255,255,255,0.7),transparent_16%),radial-gradient(circle_at_50%_88%,rgba(198,178,156,0.2),transparent_22%)]" />
        <span className="pointer-events-none absolute left-[-4%] top-[16%] h-52 w-52 rounded-full bg-white/48 blur-[72px] hero-soft-orb" />
        <span className="pointer-events-none absolute right-[-6%] top-[10%] h-64 w-64 rounded-full bg-[#e7d6c2]/46 blur-[92px] hero-soft-orb hero-soft-orb-delay-2" />
        <span className="pointer-events-none absolute bottom-[-4%] left-[34%] h-48 w-48 rounded-full bg-[#efe2d2]/50 blur-[82px] hero-soft-orb hero-soft-orb-delay-3" />
        <span className="ambient-orb left-10 top-10 h-28 w-28 bg-white/52" />
        <span className="ambient-orb bottom-10 left-[48%] h-24 w-24 bg-[#d9c4a7]/20 [animation-delay:1.2s]" />
        <span className="ambient-orb right-16 top-16 h-24 w-24 bg-white/34 [animation-delay:2s]" />

        <div className="relative grid gap-10 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(620px,1.2fr)] lg:items-center lg:gap-4 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
          <div className="relative z-10 flex flex-col justify-center lg:pe-6">
            <div
              className="flex flex-wrap items-center gap-3 hero-fade-up"
              style={animationStyle(120)}
            >
              <p className="inline-flex items-center gap-3 rounded-full border border-brown/8 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#9c826a] shadow-[0_10px_25px_rgba(72,49,30,0.05)]">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                {subtitle}
              </p>
              <span className="rounded-full border border-brown/8 bg-white/74 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#9c826a]">
                {badgeValue} {badgeLabel}
              </span>
            </div>

            <div className="mt-6 max-w-[620px]">
              <h1 className="font-serif text-[3.55rem] leading-[0.88] tracking-[-0.03em] text-[#3f2c1f] md:text-[5.1rem] xl:text-[6.3rem]">
                <span className="block hero-fade-up" style={animationStyle(220, 980)}>
                  {title.line1}
                </span>
                <span
                  className="mt-1 block text-[#a07d62] hero-fade-up"
                  style={animationStyle(340, 1040)}
                >
                  <em className="font-medium italic">{title.line2}</em>
                </span>
                <span className="block hero-fade-up" style={animationStyle(460, 1100)}>
                  {title.line3}
                </span>
              </h1>
              <p
                className="mt-8 max-w-[430px] text-[15px] leading-[1.9] text-[#6f5a49] md:text-[17px] hero-fade-up"
                style={animationStyle(580, 1120)}
              >
                {description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={productsHref}
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(93,61,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(93,61,39,0.24)] no-underline hero-fade-up hero-button-entrance"
                style={animationStyle(720, 980)}
              >
                {shopNow}
              </Link>
              <Link
                href={aboutHref}
                className="inline-flex items-center justify-center rounded-full border border-brown/8 bg-white/84 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-[#8a6b52] shadow-[0_10px_24px_rgba(72,49,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white no-underline hero-fade-up hero-button-entrance"
                style={animationStyle(840, 1020)}
              >
                {ourStory}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustPills.map((item, index) => (
                <span
                  key={item}
                  className="rounded-full border border-brown/8 bg-white/74 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#a18a75] shadow-[0_8px_22px_rgba(72,49,30,0.04)] hero-fade-up hero-chip-entrance"
                  style={animationStyle(940 + index * 90, 900)}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[500px] lg:min-h-[680px]">
            <div className="grid h-full min-h-[500px] gap-5 sm:grid-cols-[minmax(0,1fr)_230px] sm:items-stretch lg:min-h-[680px] lg:gap-7">
              <HeroVisualStage
                brandName={brandName}
                media={heroMedia}
                transforms={heroScene}
                heroImageMotionClassName="lux-product-reveal"
                accentImageMotionClassName="lux-accent-reveal"
                heroImageWrapperClassName="hero-product-shell"
                accentImageWrapperClassName="hero-accent-shell"
              />
              <div className="relative z-30 flex flex-col justify-center gap-6 pb-[16%] pt-[20%] sm:py-[18%] lg:py-[20%]">
                {insightCards.map((card, index) => (
                  <div
                    key={card.key}
                    className="hero-fade-up"
                    style={animationStyle(720 + index * 160, 1120)}
                  >
                    <div style={{ transform: card.transform }}>
                      <div
                        className={`rounded-[30px] border border-white/60 ${card.toneClass} p-5 shadow-[0_22px_45px_rgba(105,81,61,0.08)] backdrop-blur-xl transition-transform duration-300 hero-card-shell ${
                          index === 0 ? "hero-card-shell-delay-1" : "hero-card-shell-delay-2"
                        }`}
                      >
                        <small className="block text-[11px] uppercase tracking-[0.18em] text-[#c2a78f]">
                          {card.eyebrow}
                        </small>
                        <strong className="mt-3 block font-serif text-[2rem] leading-none text-[#96755d]">
                          {card.title}
                        </strong>
                        <p className="mt-4 text-[13px] leading-[1.95] text-[#806b59]">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
