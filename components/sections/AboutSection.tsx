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

  return (
    <section
      id="about"
      className="bg-warm px-[2.5rem] py-[4rem] grid grid-cols-1 md:grid-cols-2 gap-[4rem] items-center"
    >
      <div className="aspect-[4/3] bg-[#C5B49A] flex items-center justify-center overflow-hidden">
        {siteSettings?.aboutImageUrl ? (
          <img
            src={siteSettings.aboutImageUrl}
            alt={siteSettings.aboutImageAlt || siteSettings.brandName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-serif text-[18px] text-brown/[0.6]">
            Product photo here
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[1rem]">
          {subtitle}
        </p>
        <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[1.5rem]">
          {line1}
          <br />
          {line2}
        </h2>
        <p className="text-[14px] leading-[1.9] text-muted mb-[2rem]">
          {description}
        </p>
        <Button variant="secondary">{learnMore}</Button>
      </div>
    </section>
  );
}
