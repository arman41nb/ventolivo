import ViewportReveal from "@/components/animation/ViewportReveal";
import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface FeaturesGridProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

const featureIcons: Record<string, React.ReactNode> = {
  coldProcess: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  smallBatches: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  natural: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
};

export default function FeaturesGrid({
  dict,
  siteSettings,
}: FeaturesGridProps) {
  const features = dict
    ? [
        {
          key: "coldProcess",
          icon: featureIcons.coldProcess,
          title:
            siteSettings?.feature1Title ?? dict.features.items.coldProcess.title,
          text:
            siteSettings?.feature1Text ?? dict.features.items.coldProcess.text,
        },
        {
          key: "smallBatches",
          icon: featureIcons.smallBatches,
          title:
            siteSettings?.feature2Title ??
            dict.features.items.smallBatches.title,
          text:
            siteSettings?.feature2Text ?? dict.features.items.smallBatches.text,
        },
        {
          key: "natural",
          icon: featureIcons.natural,
          title: siteSettings?.feature3Title ?? dict.features.items.natural.title,
          text: siteSettings?.feature3Text ?? dict.features.items.natural.text,
        },
      ]
    : [
        {
          key: "coldProcess",
          icon: featureIcons.coldProcess,
          title: siteSettings?.feature1Title ?? "Cold Process",
          text:
            siteSettings?.feature1Text ??
            "Traditional cold-process method preserving all natural glycerin and nutrients.",
        },
        {
          key: "smallBatches",
          icon: featureIcons.smallBatches,
          title: siteSettings?.feature2Title ?? "Small Batches",
          text:
            siteSettings?.feature2Text ??
            "Each batch is made in small quantities to ensure maximum quality and freshness.",
        },
        {
          key: "natural",
          icon: featureIcons.natural,
          title: siteSettings?.feature3Title ?? "100% Natural",
          text:
            siteSettings?.feature3Text ??
            "Only plant-based oils, butters, and botanicals. Nothing artificial, ever.",
        },
      ];

  return (
    <section className="px-4 py-20 md:px-6">
      <div className="relative mx-auto max-w-[1380px]">
        <span className="pointer-events-none absolute left-[6%] top-[-8%] h-44 w-44 rounded-full bg-white/22 blur-[70px] luxe-atmosphere luxe-atmosphere-delay-1" />
        <span className="pointer-events-none absolute right-[4%] bottom-[-10%] h-40 w-40 rounded-full bg-[#e1d1bc]/26 blur-[68px] luxe-atmosphere luxe-atmosphere-delay-3" />
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <ViewportReveal
              key={feature.key}
              className={`group relative overflow-hidden rounded-[28px] border border-brown/8 bg-[rgba(255,253,249,0.7)] p-6 shadow-[0_12px_28px_rgba(72,49,30,0.06)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgba(72,49,30,0.09)] ${
                index === 1 ? "translate-y-4 md:translate-y-8" : ""
              }`}
              delay={index * 90}
              distance={30}
              duration={520}
            >
              <span className="pointer-events-none absolute right-[-10%] top-[-6%] h-32 w-32 rounded-full bg-white/26 blur-[56px] luxe-atmosphere" />
              <span className="pointer-events-none absolute inset-x-[22%] top-[18%] h-px bg-[linear-gradient(90deg,rgba(124,140,94,0),rgba(124,140,94,0.62),rgba(124,140,94,0))] luxe-line-pulse" />
              <div className="mb-4 grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-[linear-gradient(135deg,#dfe5d4,#eef2e8)] text-olive transition-transform duration-300 group-hover:scale-105 luxe-icon-float">
                {feature.icon}
              </div>
              <p className="mb-2 font-serif text-[1.6rem] text-dark luxe-heading-glide">
                {feature.title}
              </p>
              <p className="text-[14px] leading-[1.85] text-muted">{feature.text}</p>
            </ViewportReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
