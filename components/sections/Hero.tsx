"use client";
import { useEffect, type CSSProperties, type ReactNode, useState } from "react";
import Link from "next/link";
import HeroVisualStage from "@/components/sections/HeroVisualStage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import {
  getHeroSceneMediaState,
  getHeroSceneTransforms,
  type StorefrontContent,
} from "@/modules/site-content";
import type { SiteContentSettings, StorefrontPreviewBindings } from "@/types";

interface HeroProps {
  locale: Locale;
  siteSettings: SiteContentSettings;
  content: StorefrontContent["hero"] & StorefrontContent["features"];
  preview?: StorefrontPreviewBindings;
}

function animationStyle(delay: number, duration?: number): CSSProperties {
  return {
    animationDelay: `${delay}ms`,
    ...(duration ? { animationDuration: `${duration}ms` } : {}),
  };
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

export default function Hero({ locale, siteSettings, content, preview }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const isPreview = Boolean(preview);

  useEffect(() => {
    if (isPreview) {
      return;
    }

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
  }, [isPreview]);

  const heroMedia = getHeroSceneMediaState(siteSettings, siteSettings.brandName);
  const activeScrollY = isPreview ? 0 : scrollY;
  const heroScene = getHeroSceneTransforms(
    activeScrollY / (isCompactViewport ? 1120 : 720),
    heroMedia,
  );
  const publicHeroScene = getHeroSceneTransforms(scrollY / 720, heroMedia);
  const heroHighlights = content.items.slice(0, 3).map((item) => ({
    title: item.title,
    text: item.text,
  }));
  const insightCards = [
    {
      key: "process",
      eyebrow: content.items[0].title,
      title: content.items[0].title,
      text: content.items[0].text,
      transform: heroScene.processCardTransform,
      toneClass: "bg-[linear-gradient(180deg,rgba(255,251,246,0.96),rgba(248,243,237,0.84))]",
    },
    {
      key: "natural",
      eyebrow: `${content.badge.value} ${content.badge.label}`,
      title: content.items[2].title,
      text: content.items[2].text,
      transform: heroScene.naturalCardTransform,
      toneClass: "bg-[linear-gradient(180deg,rgba(255,248,246,0.96),rgba(247,239,235,0.86))]",
    },
  ];

  const productsHref = localePath(locale, "/products");
  const aboutHref = localePath(locale, "/#about");

  if (!preview) {
    const trustPills = [content.items[2].title, content.items[1].title, content.items[0].title];

    return (
      <section className="px-4 pb-5 pt-4 md:px-6 md:pt-5">
        <div className="theme-shell-surface relative mx-auto max-w-[1380px] overflow-hidden rounded-[42px] border border-white/55">
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--theme-shell-radial)" }} />
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
                <p className="theme-soft-badge inline-flex items-center gap-3 rounded-full border border-brown/8 px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {content.subtitle}
                </p>
                <span className="theme-soft-chip rounded-full border border-brown/8 px-4 py-2 text-[11px] uppercase tracking-[0.2em]">
                  {content.badge.value} {content.badge.label}
                </span>
              </div>

              <div className="mt-6 max-w-[620px]">
                <h1 className="font-serif text-[3.55rem] leading-[0.88] tracking-[-0.03em] text-dark md:text-[5.1rem] xl:text-[6.3rem]">
                  <span className="block hero-fade-up" style={animationStyle(220, 980)}>
                    {content.title.line1}
                  </span>
                  <span
                    className="theme-hero-emphasis mt-1 block hero-fade-up"
                    style={animationStyle(340, 1040)}
                  >
                    <em className="font-medium italic">{content.title.line2}</em>
                  </span>
                  <span className="block hero-fade-up" style={animationStyle(460, 1100)}>
                    {content.title.line3}
                  </span>
                </h1>
                <p
                  className="theme-hero-copy mt-8 max-w-[430px] text-[15px] leading-[1.9] md:text-[17px] hero-fade-up"
                  style={animationStyle(580, 1120)}
                >
                  {content.description}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={productsHref}
                  className="theme-primary-button inline-flex items-center justify-center rounded-full px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 no-underline hero-fade-up hero-button-entrance"
                  style={animationStyle(720, 980)}
                >
                  {content.primaryButtonLabel}
                </Link>
                <Link
                  href={aboutHref}
                  className="theme-secondary-button inline-flex items-center justify-center rounded-full border border-brown/8 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white no-underline hero-fade-up hero-button-entrance"
                  style={animationStyle(840, 1020)}
                >
                  {content.secondaryButtonLabel}
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustPills.map((item, index) => (
                  <span
                    key={item}
                    className="theme-soft-chip rounded-full border border-brown/8 px-4 py-3 text-[11px] uppercase tracking-[0.2em] hero-fade-up hero-chip-entrance"
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
                  brandName={siteSettings.brandName}
                  media={heroMedia}
                  transforms={publicHeroScene}
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
                          className={`rounded-[30px] border border-white/60 ${index === 0 ? "theme-hero-card" : "theme-hero-card-alt"} p-5 backdrop-blur-xl transition-transform duration-300 hero-card-shell ${
                            index === 0 ? "hero-card-shell-delay-1" : "hero-card-shell-delay-2"
                          }`}
                        >
                          <small className="theme-quote-accent block text-[11px] uppercase tracking-[0.18em]">
                            {card.eyebrow}
                          </small>
                          <strong className="theme-hero-emphasis mt-3 block font-serif text-[2rem] leading-none">
                            {card.title}
                          </strong>
                          <p className="theme-hero-copy mt-4 text-[13px] leading-[1.95]">
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

  return (
    <section className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4 md:px-6 md:pt-5">
      <div className="theme-shell-surface relative mx-auto max-w-[1380px] overflow-hidden rounded-[30px] border border-white/55 sm:rounded-[36px] lg:rounded-[42px]">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--theme-shell-radial)" }} />
        <span className="pointer-events-none absolute left-[-4%] top-[16%] h-52 w-52 rounded-full bg-white/48 blur-[72px] hero-soft-orb" />
        <span className="pointer-events-none absolute right-[-6%] top-[10%] h-64 w-64 rounded-full bg-[#e7d6c2]/46 blur-[92px] hero-soft-orb hero-soft-orb-delay-2" />
        <span className="pointer-events-none absolute bottom-[-4%] left-[34%] h-48 w-48 rounded-full bg-[#efe2d2]/50 blur-[82px] hero-soft-orb hero-soft-orb-delay-3" />
        <span className="ambient-orb left-10 top-10 h-28 w-28 bg-white/52" />
        <span className="ambient-orb bottom-10 left-[48%] h-24 w-24 bg-[#d9c4a7]/20 [animation-delay:1.2s]" />
        <span className="ambient-orb right-16 top-16 h-24 w-24 bg-white/34 [animation-delay:2s]" />

        <div className="relative grid gap-10 px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-center lg:gap-6 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
          <div className="relative z-10 flex flex-col justify-center lg:max-w-[590px] lg:pe-4 xl:pe-6">
            <div
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 hero-fade-up"
              style={animationStyle(120)}
            >
              <p className="theme-soft-badge inline-flex items-center gap-2.5 rounded-full border border-brown/8 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] sm:px-4 sm:text-[11px] sm:tracking-[0.22em]">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                {renderEditable(preview, "heroSubtitle", "Hero subtitle", <span>{content.subtitle}</span>)}
              </p>
              <span className="theme-soft-chip rounded-full border border-brown/8 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
                {renderEditable(preview, "heroBadgeValue", "Badge value", <span>{content.badge.value}</span>)}
                {" "}
                {renderEditable(preview, "heroBadgeLabel", "Badge label", <span>{content.badge.label}</span>)}
              </span>
            </div>

            <div className="mt-5 max-w-[620px] sm:mt-6">
              <h1 className="font-serif text-[2.85rem] leading-[0.92] tracking-[-0.04em] text-dark sm:text-[3.8rem] md:text-[4.75rem] lg:text-[4.5rem] xl:text-[5.7rem] 2xl:text-[6.3rem]">
                <span className="block hero-fade-up" style={animationStyle(220, 980)}>
                  {renderEditable(preview, "heroTitleLine1", "Hero line 1", <span>{content.title.line1}</span>)}
                </span>
                <span
                  className="theme-hero-emphasis mt-1 block hero-fade-up"
                  style={animationStyle(340, 1040)}
                >
                  {renderEditable(
                    preview,
                    "heroTitleLine2",
                    "Hero line 2",
                    <em className="font-medium italic">{content.title.line2}</em>,
                  )}
                </span>
                <span className="block hero-fade-up" style={animationStyle(460, 1100)}>
                  {renderEditable(preview, "heroTitleLine3", "Hero line 3", <span>{content.title.line3}</span>)}
                </span>
              </h1>
              {renderEditable(
                preview,
                "heroDescription",
                "Hero description",
                <p
                  className="theme-hero-copy mt-6 max-w-[32rem] text-[14px] leading-[1.85] sm:mt-7 sm:text-[15px] md:mt-8 md:text-[17px] hero-fade-up"
                  style={animationStyle(580, 1120)}
                >
                  {content.description}
                </p>,
                "block max-w-[32rem]",
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {preview ? (
                renderEditable(
                  preview,
                  "heroPrimaryButtonLabel",
                  "Primary button",
                  <span
                    className="theme-primary-button inline-flex min-h-14 items-center justify-center rounded-full px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                    style={animationStyle(720, 980)}
                  >
                    {content.primaryButtonLabel}
                  </span>,
                  "w-fit",
                )
              ) : (
                <Link
                  href={productsHref}
                  className="theme-primary-button inline-flex min-h-14 items-center justify-center rounded-full px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 no-underline sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                  style={animationStyle(720, 980)}
                >
                  {content.primaryButtonLabel}
                </Link>
              )}
              {preview ? (
                renderEditable(
                  preview,
                  "heroSecondaryButtonLabel",
                  "Secondary button",
                  <span
                    className="theme-secondary-button inline-flex min-h-14 items-center justify-center rounded-full border border-brown/8 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                    style={animationStyle(840, 1020)}
                  >
                    {content.secondaryButtonLabel}
                  </span>,
                  "w-fit",
                )
              ) : (
                <Link
                  href={aboutHref}
                  className="theme-secondary-button inline-flex min-h-14 items-center justify-center rounded-full border border-brown/8 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white no-underline sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                  style={animationStyle(840, 1020)}
                >
                  {content.secondaryButtonLabel}
                </Link>
              )}
            </div>

            <div
              className="theme-panel-surface mt-7 rounded-[24px] border border-white/65 p-3.5 sm:mt-8 sm:rounded-[28px] sm:p-4 hero-fade-up"
              style={animationStyle(940, 980)}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2.5 sm:mb-4 sm:gap-3">
                <span className="theme-soft-badge inline-flex items-center gap-2 rounded-full border border-brown/8 px-3 py-2 text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {renderEditable(preview, "heroBadgeValue", "Badge value", <span>{content.badge.value}</span>)}
                  {" "}
                  {renderEditable(preview, "heroBadgeLabel", "Badge label", <span>{content.badge.label}</span>)}
                </span>
                <span className="theme-quote-accent text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]">
                  {renderEditable(preview, "brandName", "Brand name", <span>{siteSettings.brandName}</span>)}
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[20px] border border-brown/7 bg-white/60 px-3.5 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.75)] hero-chip-entrance"
                    style={animationStyle(1000 + index * 90, 900)}
                  >
                    <p className="theme-quote-accent text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]">
                      {renderEditable(
                        preview,
                        (`feature${index + 1}Title` as "feature1Title" | "feature2Title" | "feature3Title"),
                        `Feature ${index + 1} title`,
                        <span>{item.title}</span>,
                      )}
                    </p>
                    <p className="theme-hero-copy mt-2 text-[12px] leading-[1.7]">
                      {renderEditable(
                        preview,
                        (`feature${index + 1}Text` as "feature1Text" | "feature2Text" | "feature3Text"),
                        `Feature ${index + 1} text`,
                        <span>{item.text}</span>,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 min-h-[420px] sm:min-h-[520px] lg:min-h-[680px]">
            <div className="grid h-full min-h-[420px] gap-4 sm:min-h-[520px] sm:gap-5 lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_240px] lg:items-stretch lg:gap-7">
              <HeroVisualStage
                brandName={siteSettings.brandName}
                media={heroMedia}
                transforms={heroScene}
                renderAccentImage={(contentNode, props) =>
                  preview?.renderEditable({
                    fieldId: "heroAccentImage",
                    label: "Hero accent image",
                    children: contentNode,
                    className: props.className,
                    contentClassName: props.contentClassName,
                    style: props.style,
                  }) ?? contentNode
                }
                renderHeroImage={(contentNode, props) =>
                  preview?.renderEditable({
                    fieldId: "heroImage",
                    label: "Hero image",
                    children: contentNode,
                    className: props.className,
                    contentClassName: props.contentClassName,
                    style: props.style,
                  }) ?? contentNode
                }
                renderBrandBadge={(contentNode, props) =>
                  preview?.renderEditable({
                    fieldId: "brandName",
                    label: "Brand badge",
                    children: contentNode,
                    className: props.className,
                    contentClassName: props.contentClassName,
                    style: props.style,
                  }) ?? contentNode
                }
                heroImageMotionClassName="lux-product-reveal"
                accentImageMotionClassName="lux-accent-reveal"
                heroImageWrapperClassName="hero-product-shell"
                accentImageWrapperClassName="hero-accent-shell"
              />
              <div className="relative z-30 grid gap-4 sm:grid-cols-2 lg:flex lg:flex-col lg:justify-center lg:gap-6 lg:pb-[16%] lg:pt-[20%]">
                {insightCards.map((card, index) => (
                  <div
                    key={card.key}
                    className="hero-fade-up"
                    style={animationStyle(720 + index * 160, 1120)}
                  >
                    <div style={{ transform: card.transform }}>
                      <div
                        className={`rounded-[24px] border border-white/60 ${index === 0 ? "theme-hero-card" : "theme-hero-card-alt"} p-4 backdrop-blur-xl transition-transform duration-300 sm:rounded-[28px] sm:p-5 hero-card-shell ${
                          index === 0 ? "hero-card-shell-delay-1" : "hero-card-shell-delay-2"
                        }`}
                      >
                        <small className="theme-quote-accent block text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]">
                          {renderEditable(
                            preview,
                            index === 0 ? "feature1Title" : "heroBadgeValue",
                            index === 0 ? "Feature 1 eyebrow" : "Badge eyebrow",
                            <span>{card.eyebrow}</span>,
                          )}
                        </small>
                        <strong className="theme-hero-emphasis mt-3 block font-serif text-[1.65rem] leading-none sm:text-[1.9rem] lg:text-[2rem]">
                          {renderEditable(
                            preview,
                            index === 0 ? "feature1Title" : "feature3Title",
                            index === 0 ? "Feature 1 title" : "Feature 3 title",
                            <span>{card.title}</span>,
                          )}
                        </strong>
                        <p className="theme-hero-copy mt-3 text-[12px] leading-[1.8] sm:mt-4 sm:text-[13px] sm:leading-[1.95]">
                          {renderEditable(
                            preview,
                            index === 0 ? "feature1Text" : "feature3Text",
                            index === 0 ? "Feature 1 text" : "Feature 3 text",
                            <span>{card.text}</span>,
                          )}
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
