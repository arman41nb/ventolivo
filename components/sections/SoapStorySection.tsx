"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Dictionary } from "@/i18n";
import { clampProgress } from "@/modules/media/transform";
import { getHeroSceneMediaState } from "@/modules/site-content/hero-scene";
import type { SiteContentSettings } from "@/types";

const secondaryImageUrl =
  "/uploads/media/1775602871044-24e66b75-50aa-4814-8038-6aa81de42954-natural-handmade-soap-with-ingredients-list.png";
const secondaryImageAlt =
  "Illustrated ingredient composition behind the main handcrafted soap";

interface SoapStorySectionProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function revealAmount(progress: number, start: number, duration = 0.1) {
  return easeOutCubic(clampProgress((progress - start) / duration));
}

function revealStyle(
  progress: number,
  start: number,
  options?: {
    x?: number;
    y?: number;
    scaleFrom?: number;
    blurFrom?: number;
  },
): CSSProperties {
  const amount = revealAmount(progress, start);
  const x = mix(options?.x ?? 0, 0, amount);
  const y = mix(options?.y ?? 34, 0, amount);
  const scale = mix(options?.scaleFrom ?? 0.98, 1, amount);

  return {
    opacity: amount,
    transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
    willChange: "transform, opacity",
  };
}

export default function SoapStorySection({
  dict,
  siteSettings,
}: SoapStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef(0);
  const initializedRef = useRef(false);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      setProgress(1);
      return;
    }

    const computeProgress = () => {
      const node = sectionRef.current;

      if (!node) {
        return targetProgressRef.current;
      }

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = Math.max(rect.height - viewportHeight * 0.42, 1);
      const raw = (viewportHeight * 0.7 - rect.top) / travel;

      return clampProgress(raw);
    };

    const animateProgress = () => {
      frameRef.current = 0;

      const nextTarget = computeProgress();
      targetProgressRef.current = nextTarget;

      const current = currentProgressRef.current;
      const next =
        Math.abs(nextTarget - current) < 0.0015
          ? nextTarget
          : current + (nextTarget - current) * 0.34;

      currentProgressRef.current = next;
      setProgress(next);

      if (Math.abs(nextTarget - next) > 0.0015) {
        frameRef.current = window.requestAnimationFrame(animateProgress);
      }
    };

    const requestTick = () => {
      targetProgressRef.current = computeProgress();

      if (!initializedRef.current) {
        initializedRef.current = true;
        currentProgressRef.current = targetProgressRef.current;
        setProgress(targetProgressRef.current);
        return;
      }

      if (frameRef.current === 0) {
        frameRef.current = window.requestAnimationFrame(animateProgress);
      }
    };

    requestTick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    return () => {
      if (frameRef.current !== 0) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
    };
  }, []);

  const brandName = siteSettings?.brandName ?? "Ventolivo";
  const heroMedia = getHeroSceneMediaState(siteSettings, brandName);
  const copy = dict?.storySection ?? {
    eyebrow: "Inspired by nature",
    title: "Nature, memory, and the rituals we turn into soap.",
    lead: "We design from scenes that stay with us, drawn equally from nature and human life.",
    body:
      "A dried leaf carried by a narrow stream, a sandstorm across the desert, a bay that feels like paradise, an emerald seam, life beneath the sea, a carefully brewed coffee, the grain of a wooden table, confetti suspended in the air. What we love to watch, touch, and taste becomes part of our handmade soaps, always in harmony with nature and human life.",
    closing: "Your skin deserves the best. So does your soul.",
    ritualLabel: "Handmade ritual",
    momentsLabel: "Sensory notes",
    momentsValue: "Leaf, desert, bay, emerald, coffee, wood, confetti.",
    detailLabel: "Organic composition",
    detailText: "Layered with calm motion, mineral warmth, and tactile detail.",
    studyLabel: "Sensory study",
    studyText: "Crafted for skin and soul",
  };

  const visualProgress = easeOutCubic(progress);
  const lineReveal = revealAmount(progress, 0.05, 0.08);
  const soapReveal = revealAmount(progress, 0.0, 0.08);
  const accentReveal = revealAmount(progress, 0.0, 0.07);
  const ritualReveal = revealAmount(progress, 0.07, 0.08);
  const detailReveal = revealAmount(progress, 0.12, 0.08);
  const studyReveal = revealAmount(progress, 0.17, 0.08);
  const momentsReveal = revealAmount(progress, 0.21, 0.08);
  const soapX = mix(-68, 24, visualProgress);
  const soapY = mix(64, -32, visualProgress);
  const soapRotate = mix(-18, 1.5, visualProgress);
  const soapScale = mix(0.78, 1.08, visualProgress);
  const accentX = mix(56, -20, visualProgress);
  const accentY = mix(232, -12, visualProgress);
  const accentRotate = mix(18, 2, visualProgress);
  const accentScale = mix(0.58, 1.08, visualProgress);
  const panelShift = mix(52, -10, visualProgress);
  const glowShift = mix(48, -22, visualProgress);
  const haloRotate = mix(-8, 7, visualProgress);
  const soapShadowScale = mix(0.74, 1.1, visualProgress);
  const accentShadowScale = mix(0.66, 1.12, visualProgress);
  const ritualFloat = mix(30, -12, visualProgress);
  const detailFloat = mix(24, -10, visualProgress);
  const studyFloat = mix(24, -8, visualProgress);
  const momentsFloat = mix(36, -14, visualProgress);

  return (
    <section
      ref={sectionRef}
      className="px-4 pb-10 pt-2 md:px-6 md:pb-12"
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="relative overflow-hidden rounded-[42px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(242,233,223,0.94))] shadow-[0_28px_90px_rgba(109,82,58,0.14)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.96),transparent_18%),radial-gradient(circle_at_80%_16%,rgba(255,255,255,0.72),transparent_15%),radial-gradient(circle_at_50%_82%,rgba(198,178,156,0.18),transparent_26%)]" />
          <span className="ambient-orb left-10 top-12 h-24 w-24 bg-white/40" />
          <span className="ambient-orb right-16 top-18 h-20 w-20 bg-[#d7c0aa]/24 [animation-delay:1.2s]" />
          <span className="ambient-orb bottom-10 left-[44%] h-24 w-24 bg-white/28 [animation-delay:2.4s]" />

          <div className="relative min-h-[920px] lg:min-h-[106vh]">
            <div className="grid gap-10 px-5 py-8 md:px-8 md:py-10 lg:sticky lg:top-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center lg:gap-6 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
              <div className="relative z-20 max-w-[610px]">
                <div
                  className="inline-flex items-center gap-3 rounded-full border border-brown/8 bg-white/76 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#9f8269] shadow-[0_10px_22px_rgba(72,49,30,0.05)]"
                  style={revealStyle(progress, 0.02, {
                    x: -18,
                    y: 24,
                    scaleFrom: 0.94,
                    blurFrom: 8,
                  })}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {copy.eyebrow}
                </div>

                <div
                  className="mt-5"
                  style={revealStyle(progress, 0.06, {
                    x: -24,
                    y: 28,
                    scaleFrom: 0.96,
                    blurFrom: 8,
                  })}
                >
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/60 bg-[rgba(255,252,247,0.88)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#ab8a72] shadow-[0_14px_28px_rgba(105,81,61,0.06)] backdrop-blur-xl">
                      {brandName}
                    </span>
                    <span className="rounded-full border border-brown/8 bg-white/62 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b29178]">
                      {copy.ritualLabel}
                    </span>
                  </div>
                  <h2 className="max-w-[560px] font-serif text-[3rem] leading-[0.88] tracking-[-0.03em] text-[#3f2c1f] md:text-[4.35rem] xl:text-[5.35rem]">
                    {copy.title}
                  </h2>

                  <div
                    className="mt-6 flex items-center gap-4"
                    style={revealStyle(progress, 0.11, {
                      x: -14,
                      y: 20,
                      scaleFrom: 0.98,
                      blurFrom: 6,
                    })}
                  >
                    <span
                      className="h-px w-16 origin-left bg-[linear-gradient(90deg,rgba(141,109,83,0.9),rgba(141,109,83,0.16))]"
                      style={{
                        transform: `scaleX(${mix(0.56, 1, lineReveal).toFixed(4)})`,
                        opacity: lineReveal,
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.26em] text-[#b08b6f]">
                      {copy.momentsLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-7 border-t border-brown/10 pt-6">
                  <p
                    className="max-w-[520px] text-[17px] leading-[1.9] text-[#6e5949] md:text-[19px]"
                    style={revealStyle(progress, 0.14, {
                      x: -18,
                      y: 24,
                      scaleFrom: 0.98,
                    })}
                  >
                    {copy.lead}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
                    <p
                      className="text-[14px] leading-[2] text-[#7b6657] md:text-[15px]"
                      style={revealStyle(progress, 0.2, {
                        x: -12,
                        y: 26,
                        scaleFrom: 0.99,
                      })}
                    >
                      {copy.body}
                    </p>

                    <div
                      className="rounded-[26px] border border-white/68 bg-[linear-gradient(180deg,rgba(255,252,248,0.92),rgba(247,239,232,0.82))] p-5 shadow-[0_16px_30px_rgba(105,81,61,0.08)] backdrop-blur-xl"
                      style={revealStyle(progress, 0.24, {
                        x: 18,
                        y: 22,
                        scaleFrom: 0.94,
                        blurFrom: 10,
                      })}
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b39179]">
                        {copy.momentsLabel}
                      </p>
                      <p className="mt-3 text-[13px] leading-[1.9] text-[#7d6757]">
                        {copy.momentsValue}
                      </p>
                    </div>
                  </div>
                </div>

                <p
                  className="mt-9 max-w-[420px] font-serif text-[1.9rem] leading-[1.22] text-[#5f4433] italic md:text-[2.2rem]"
                  style={revealStyle(progress, 0.3, {
                    x: -8,
                    y: 18,
                    scaleFrom: 0.97,
                    blurFrom: 8,
                  })}
                >
                  "{copy.closing}"
                </p>
              </div>

              <div className="relative z-10 min-h-[430px] lg:min-h-[610px]">
                <div className="relative mx-auto h-full min-h-[430px] max-w-[640px] lg:min-h-[610px]">
                  <div
                    className="absolute inset-x-[7%] top-[11%] bottom-[9%] rounded-[42px] border border-white/56 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(245,235,224,0.24))] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_28px_62px_rgba(109,82,58,0.08)]"
                    style={{
                      transform: `translate3d(0, ${panelShift.toFixed(2)}px, 0) scale(${mix(
                        0.95,
                        1.01,
                        visualProgress,
                      ).toFixed(4)})`,
                      willChange: "transform",
                    }}
                  />
                  <div
                    className="absolute right-[8%] top-[12%] h-[60%] w-[36%] rounded-[38px] border border-white/52 bg-[linear-gradient(180deg,rgba(255,251,246,0.78),rgba(244,233,224,0.28))] shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]"
                    style={{
                      transform: `translate3d(0, ${(panelShift * 0.7).toFixed(2)}px, 0)`,
                      willChange: "transform",
                    }}
                  />
                  <div
                    className="absolute left-[10%] top-[8%] h-[56%] w-[78%] rounded-[999px] bg-[radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.98),rgba(255,255,255,0.82)_32%,rgba(239,228,217,0.28)_66%,transparent_84%)]"
                    style={{
                      transform: `translate3d(0, ${glowShift.toFixed(2)}px, 0) scale(${mix(
                        0.92,
                        1.08,
                        visualProgress,
                      ).toFixed(4)}) rotate(${haloRotate.toFixed(2)}deg)`,
                      willChange: "transform",
                    }}
                  />
                  <div
                    className="absolute left-[12%] top-[18%] h-px w-[34%] bg-[linear-gradient(90deg,rgba(153,120,94,0.68),rgba(153,120,94,0.08))]"
                    style={{
                      opacity: lineReveal,
                      transform: `translate3d(0, ${mix(16, 0, lineReveal).toFixed(
                        2,
                      )}px, 0) scaleX(${mix(0.52, 1, lineReveal).toFixed(4)})`,
                      transformOrigin: "left center",
                      willChange: "transform, opacity",
                    }}
                  />
                  <div
                    className="absolute bottom-[16%] left-[18%] h-16 w-[60%] rounded-full bg-[radial-gradient(circle,rgba(109,77,53,0.28),rgba(109,77,53,0.08)_42%,transparent_74%)] blur-2xl"
                    style={{
                      transform: `scale(${soapShadowScale.toFixed(4)}) translate3d(${mix(
                        -10,
                        14,
                        visualProgress,
                      ).toFixed(2)}px, ${mix(12, 18, visualProgress).toFixed(2)}px, 0)`,
                      willChange: "transform",
                    }}
                  />
                  <div
                    className="absolute bottom-[24%] right-[12%] h-12 w-[34%] rounded-full bg-[radial-gradient(circle,rgba(152,128,110,0.2),rgba(152,128,110,0.05)_42%,transparent_76%)] blur-xl"
                    style={{
                      transform: `scale(${accentShadowScale.toFixed(4)}) translate3d(${mix(
                        18,
                        -12,
                        visualProgress,
                      ).toFixed(2)}px, ${mix(18, -8, visualProgress).toFixed(2)}px, 0)`,
                      opacity: accentReveal,
                      willChange: "transform, opacity",
                    }}
                  />

                  <div
                    className="absolute right-[9%] top-[12%] z-10 aspect-[5/7] w-[41%] min-w-[170px] max-w-[285px]"
                    style={{
                      opacity: accentReveal,
                      transform: `translate3d(${accentX.toFixed(2)}px, ${accentY.toFixed(
                        2,
                      )}px, 0) rotate(${accentRotate.toFixed(2)}deg) scale(${accentScale.toFixed(
                        4,
                      )})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <img
                      src={secondaryImageUrl}
                      alt={secondaryImageAlt}
                      className="h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                      style={{
                        filter: "drop-shadow(0 34px 42px rgba(93,61,39,0.18))",
                        transform: "translateZ(0)",
                      }}
                    />
                  </div>

                  <div
                    className="absolute left-[4%] top-[11%] z-30 max-w-[180px] rounded-[20px] border border-white/65 bg-[rgba(255,252,248,0.78)] px-4 py-3 shadow-[0_14px_26px_rgba(105,81,61,0.08)] backdrop-blur-xl"
                    style={{
                      opacity: ritualReveal,
                      transform: `translate3d(${mix(-24, 0, ritualReveal).toFixed(
                        2,
                      )}px, ${ritualFloat.toFixed(2)}px, 0) scale(${mix(
                        0.9,
                        1,
                        ritualReveal,
                      ).toFixed(4)})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#b39078]">
                      {copy.ritualLabel}
                    </p>
                    <p className="mt-2 text-[12px] leading-[1.75] text-[#7d6757]">
                      {brandName}
                    </p>
                  </div>

                  <div
                    className="absolute right-[4%] top-[10%] z-30 max-w-[170px] rounded-[20px] border border-white/65 bg-[rgba(255,252,248,0.78)] px-4 py-3 shadow-[0_14px_26px_rgba(105,81,61,0.08)] backdrop-blur-xl"
                    style={{
                      opacity: detailReveal,
                      transform: `translate3d(${mix(24, 0, detailReveal).toFixed(
                        2,
                      )}px, ${detailFloat.toFixed(2)}px, 0) scale(${mix(
                        0.9,
                        1,
                        detailReveal,
                      ).toFixed(4)})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#b39078]">
                      {copy.detailLabel}
                    </p>
                    <p className="mt-2 text-[12px] leading-[1.75] text-[#7d6757]">
                      {copy.detailText}
                    </p>
                  </div>

                  <div
                    className="absolute left-[-1%] top-[1%] z-20 w-[92%] max-w-[610px]"
                    style={{
                      opacity: soapReveal,
                      transform: `translate3d(${soapX.toFixed(2)}px, ${soapY.toFixed(
                        2,
                      )}px, 0) rotate(${soapRotate.toFixed(2)}deg) scale(${soapScale.toFixed(
                        4,
                      )})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    {heroMedia.heroImageUrl ? (
                      <img
                        src={heroMedia.heroImageUrl}
                        alt={heroMedia.heroImageAlt}
                        className="w-full object-contain"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        style={{
                          filter: "drop-shadow(0 48px 64px rgba(78,54,37,0.28))",
                          transform: "translateZ(0)",
                        }}
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full rounded-[36px] bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(236,223,209,0.9))] shadow-[0_32px_50px_rgba(78,54,37,0.12)]" />
                    )}
                  </div>

                  <div
                    className="absolute bottom-[12%] left-[8%] z-30 max-w-[220px] rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,248,0.9),rgba(246,238,230,0.8))] px-5 py-4 shadow-[0_18px_34px_rgba(105,81,61,0.1)] backdrop-blur-xl"
                    style={{
                      opacity: studyReveal,
                      transform: `translate3d(${mix(-18, 0, studyReveal).toFixed(
                        2,
                      )}px, ${studyFloat.toFixed(2)}px, 0) scale(${mix(
                        0.92,
                        1,
                        studyReveal,
                      ).toFixed(4)})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#b39078]">
                      {copy.studyLabel}
                    </p>
                    <p className="mt-3 font-serif text-[1.45rem] leading-[1] text-[#735844]">
                      {copy.studyText}
                    </p>
                  </div>

                  <div
                    className="absolute bottom-[10%] right-[8%] z-30 max-w-[220px] rounded-[22px] border border-white/68 bg-[rgba(255,252,248,0.82)] px-4 py-4 shadow-[0_18px_30px_rgba(105,81,61,0.08)] backdrop-blur-xl"
                    style={{
                      opacity: momentsReveal,
                      transform: `translate3d(${mix(20, 0, momentsReveal).toFixed(
                        2,
                      )}px, ${momentsFloat.toFixed(2)}px, 0) scale(${mix(
                        0.92,
                        1,
                        momentsReveal,
                      ).toFixed(4)})`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b39078]">
                      {copy.momentsLabel}
                    </p>
                    <p className="mt-2 text-[12px] leading-[1.75] text-[#7d6757]">
                      {copy.momentsValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
