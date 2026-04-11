import ViewportReveal from "@/components/animation/ViewportReveal";
import type { StorefrontContent } from "@/modules/site-content";
import type { StorefrontPreviewBindings } from "@/types";

interface FeaturesGridProps {
  content: StorefrontContent["features"];
  preview?: StorefrontPreviewBindings;
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

export default function FeaturesGrid({ content, preview }: FeaturesGridProps) {
  const features = content.items.map((feature) => ({
    ...feature,
    icon: featureIcons[feature.key],
  }));

  return (
    <section className="px-4 py-16 md:px-6 md:py-20">
      <div className="relative mx-auto max-w-[1380px]">
        <span className="pointer-events-none absolute left-[6%] top-[-8%] h-44 w-44 rounded-full bg-white/22 blur-[70px] luxe-atmosphere luxe-atmosphere-delay-1" />
        <span className="pointer-events-none absolute right-[4%] bottom-[-10%] h-40 w-40 rounded-full bg-[#e1d1bc]/26 blur-[68px] luxe-atmosphere luxe-atmosphere-delay-3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {features.map((feature, index) => (
            <ViewportReveal
              key={feature.key}
              className={`theme-card-surface group relative overflow-hidden rounded-[26px] border border-brown/8 p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgb(var(--storefront-primary-rgb)/0.09)] sm:p-6 ${
                index === 1 ? "xl:translate-y-8" : ""
              }`}
              delay={index * 90}
              distance={30}
              duration={520}
            >
              <span className="pointer-events-none absolute right-[-10%] top-[-6%] h-32 w-32 rounded-full bg-white/26 blur-[56px] luxe-atmosphere" />
              <span className="pointer-events-none absolute inset-x-[22%] top-[18%] h-px bg-[linear-gradient(90deg,rgba(124,140,94,0),rgba(124,140,94,0.62),rgba(124,140,94,0))] luxe-line-pulse" />
              <div className="mb-4 grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--storefront-accent)_18%,white_82%),color-mix(in_srgb,var(--storefront-accent)_10%,white_90%))] text-olive transition-transform duration-300 group-hover:scale-105 luxe-icon-float">
                {feature.icon}
              </div>
              <p className="mb-2 font-serif text-[1.6rem] text-dark luxe-heading-glide">
                {preview?.renderEditable({
                  fieldId: (`feature${index + 1}Title` as "feature1Title" | "feature2Title" | "feature3Title"),
                  label: `Feature ${index + 1} title`,
                  children: <span>{feature.title}</span>,
                  className: "w-fit",
                }) ?? feature.title}
              </p>
              {preview?.renderEditable({
                fieldId: (`feature${index + 1}Text` as "feature1Text" | "feature2Text" | "feature3Text"),
                label: `Feature ${index + 1} text`,
                children: <p className="text-[14px] leading-[1.85] text-muted">{feature.text}</p>,
                className: "block",
              }) ?? <p className="text-[14px] leading-[1.85] text-muted">{feature.text}</p>}
            </ViewportReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
