/* eslint-disable @next/next/no-img-element */
import Button from "@/components/ui/Button";
import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface AboutSectionProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

export default function AboutSection({
  dict,
  siteSettings,
}: AboutSectionProps) {
  const subtitle = siteSettings?.aboutSubtitle ?? dict?.about.subtitle ?? "Our Story";
  const title = dict?.about.title ?? {
    line1: "Made by hand,",
    line2: "made with love.",
  };
  const line1 = siteSettings?.aboutTitleLine1 ?? title.line1;
  const line2 = siteSettings?.aboutTitleLine2 ?? title.line2;
  const description =
    siteSettings?.aboutDescription ??
    dict?.about.description ??
    "Every Ventolivo soap is crafted in small batches using cold-process methods and the finest natural ingredients. No shortcuts, no chemicals — just pure, honest skincare.";
  const learnMore =
    siteSettings?.aboutButtonLabel ?? dict?.about.learnMore ?? "Learn More";
  const chips = [
    siteSettings?.stripBannerItem1 ?? dict?.stripBanner.items?.[0] ?? "Handcrafted",
    siteSettings?.stripBannerItem2 ?? dict?.stripBanner.items?.[1] ?? "Natural Oils",
    siteSettings?.stripBannerItem4 ?? dict?.stripBanner.items?.[3] ?? "Made in Denizli",
  ];

  return (
    <section
      id="about"
      className="px-4 py-20 md:px-6"
    >
      <div className="mx-auto grid max-w-[1380px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="animate-rise relative min-h-[520px] overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#dbcdbd,#cbb89d)] shadow-[0_14px_36px_rgba(72,49,30,0.08)]">
          <span className="ambient-orb left-8 top-8 h-24 w-24 bg-white/24" />
          <span className="ambient-orb bottom-8 right-8 h-20 w-20 bg-brown/10 [animation-delay:1s]" />
          {siteSettings?.aboutImageUrl ? (
            <img
              src={siteSettings.aboutImageUrl}
              alt={siteSettings.aboutImageAlt || siteSettings.brandName}
              className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.03]"
            />
          ) : (
            <div className="relative h-full w-full bg-[linear-gradient(180deg,rgba(93,61,39,0.05),rgba(93,61,39,0.28)),radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_28%),linear-gradient(135deg,#d9cab7_0%,#bea887_100%)]" />
          )}
        </div>

        <div className="animate-rise animate-rise-delay-2 relative flex flex-col justify-center rounded-[32px] border border-brown/8 bg-[linear-gradient(135deg,rgba(255,252,247,0.86),rgba(239,228,215,0.92))] p-8 shadow-[0_14px_36px_rgba(72,49,30,0.08)] md:p-12">
          <span className="ambient-orb right-10 top-8 h-16 w-16 bg-olive/12 [animation-delay:1.6s]" />
          <p className="mb-4 text-[12px] uppercase tracking-[0.2em] text-olive">
            {subtitle}
          </p>
          <h2 className="font-serif text-[3rem] leading-[0.96] text-dark md:text-[4.6rem]">
            {line1}
            <br />
            {line2}
          </h2>
          <p className="mb-5 mt-6 text-[15px] leading-[1.95] text-muted">
            {description}
          </p>
          <div className="mb-7 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-brown/10 bg-white/65 px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-[#5d3d27]"
              >
                {chip}
              </span>
            ))}
          </div>
          <Button variant="primary">{learnMore}</Button>
        </div>
      </div>
    </section>
  );
}
