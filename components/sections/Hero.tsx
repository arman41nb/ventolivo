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

  return (
    <section className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4 md:px-6 md:pt-5">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[30px] border border-white/55 bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(244,236,228,0.94))] shadow-[0_28px_90px_rgba(109,82,58,0.14)] sm:rounded-[36px] lg:rounded-[42px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.95),transparent_20%),radial-gradient(circle_at_82%_15%,rgba(255,255,255,0.7),transparent_16%),radial-gradient(circle_at_50%_88%,rgba(198,178,156,0.2),transparent_22%)]" />
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
              <p className="inline-flex items-center gap-2.5 rounded-full border border-brown/8 bg-white/82 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#9c826a] shadow-[0_10px_25px_rgba(72,49,30,0.05)] sm:px-4 sm:text-[11px] sm:tracking-[0.22em]">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                {renderEditable(preview, "heroSubtitle", "Hero subtitle", <span>{content.subtitle}</span>)}
              </p>
              <span className="rounded-full border border-brown/8 bg-white/74 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] text-[#9c826a] sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
                {renderEditable(preview, "heroBadgeValue", "Badge value", <span>{content.badge.value}</span>)}
                {" "}
                {renderEditable(preview, "heroBadgeLabel", "Badge label", <span>{content.badge.label}</span>)}
              </span>
            </div>

            <div className="mt-5 max-w-[620px] sm:mt-6">
              <h1 className="font-serif text-[2.85rem] leading-[0.92] tracking-[-0.04em] text-[#3f2c1f] sm:text-[3.8rem] md:text-[4.75rem] lg:text-[4.5rem] xl:text-[5.7rem] 2xl:text-[6.3rem]">
                <span className="block hero-fade-up" style={animationStyle(220, 980)}>
                  {renderEditable(preview, "heroTitleLine1", "Hero line 1", <span>{content.title.line1}</span>)}
                </span>
                <span
                  className="mt-1 block text-[#a07d62] hero-fade-up"
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
                  className="mt-6 max-w-[32rem] text-[14px] leading-[1.85] text-[#6f5a49] sm:mt-7 sm:text-[15px] md:mt-8 md:text-[17px] hero-fade-up"
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
                    className="inline-flex min-h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(93,61,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(93,61,39,0.24)] sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                    style={animationStyle(720, 980)}
                  >
                    {content.primaryButtonLabel}
                  </span>,
                  "w-fit",
                )
              ) : (
                <Link
                  href={productsHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(93,61,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(93,61,39,0.24)] no-underline sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
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
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-brown/8 bg-white/84 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-[#8a6b52] shadow-[0_10px_24px_rgba(72,49,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                    style={animationStyle(840, 1020)}
                  >
                    {content.secondaryButtonLabel}
                  </span>,
                  "w-fit",
                )
              ) : (
                <Link
                  href={aboutHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-brown/8 bg-white/84 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-[#8a6b52] shadow-[0_10px_24px_rgba(72,49,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white no-underline sm:px-7 sm:text-[13px] hero-fade-up hero-button-entrance"
                  style={animationStyle(840, 1020)}
                >
                  {content.secondaryButtonLabel}
                </Link>
              )}
            </div>

            <div
              className="mt-7 rounded-[24px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(247,239,232,0.84))] p-3.5 shadow-[0_20px_40px_rgba(72,49,30,0.07)] sm:mt-8 sm:rounded-[28px] sm:p-4 hero-fade-up"
              style={animationStyle(940, 980)}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2.5 sm:mb-4 sm:gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brown/8 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#8b6d54] shadow-[0_8px_20px_rgba(72,49,30,0.04)] sm:text-[11px] sm:tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {renderEditable(preview, "heroBadgeValue", "Badge value", <span>{content.badge.value}</span>)}
                  {" "}
                  {renderEditable(preview, "heroBadgeLabel", "Badge label", <span>{content.badge.label}</span>)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#b0947d] sm:text-[11px] sm:tracking-[0.22em]">
                  {renderEditable(preview, "brandName", "Brand name", <span>{siteSettings.brandName}</span>)}
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[20px] border border-brown/7 bg-white/60 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hero-chip-entrance"
                    style={animationStyle(1000 + index * 90, 900)}
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#a68872] sm:text-[11px] sm:tracking-[0.18em]">
                      {renderEditable(
                        preview,
                        (`feature${index + 1}Title` as "feature1Title" | "feature2Title" | "feature3Title"),
                        `Feature ${index + 1} title`,
                        <span>{item.title}</span>,
                      )}
                    </p>
                    <p className="mt-2 text-[12px] leading-[1.7] text-[#6f5a49]">
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
                        className={`rounded-[24px] border border-white/60 ${card.toneClass} p-4 shadow-[0_18px_38px_rgba(105,81,61,0.08)] backdrop-blur-xl transition-transform duration-300 sm:rounded-[28px] sm:p-5 sm:shadow-[0_22px_45px_rgba(105,81,61,0.08)] hero-card-shell ${
                          index === 0 ? "hero-card-shell-delay-1" : "hero-card-shell-delay-2"
                        }`}
                      >
                        <small className="block text-[10px] uppercase tracking-[0.16em] text-[#c2a78f] sm:text-[11px] sm:tracking-[0.18em]">
                          {renderEditable(
                            preview,
                            index === 0 ? "feature1Title" : "heroBadgeValue",
                            index === 0 ? "Feature 1 eyebrow" : "Badge eyebrow",
                            <span>{card.eyebrow}</span>,
                          )}
                        </small>
                        <strong className="mt-3 block font-serif text-[1.65rem] leading-none text-[#96755d] sm:text-[1.9rem] lg:text-[2rem]">
                          {renderEditable(
                            preview,
                            index === 0 ? "feature1Title" : "feature3Title",
                            index === 0 ? "Feature 1 title" : "Feature 3 title",
                            <span>{card.title}</span>,
                          )}
                        </strong>
                        <p className="mt-3 text-[12px] leading-[1.8] text-[#806b59] sm:mt-4 sm:text-[13px] sm:leading-[1.95]">
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
