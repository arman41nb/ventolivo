/* eslint-disable @next/next/no-img-element */
import ViewportReveal from "@/components/animation/ViewportReveal";
import Button from "@/components/ui/Button";
import type { StorefrontContent } from "@/modules/site-content";
import type { SiteContentSettings, StorefrontPreviewBindings } from "@/types";

interface AboutSectionProps {
  siteSettings: SiteContentSettings;
  content: StorefrontContent["about"];
  preview?: StorefrontPreviewBindings;
}

export default function AboutSection({ siteSettings, content, preview }: AboutSectionProps) {
  return (
    <section id="about" className="px-4 py-20 md:px-6">
      <div className="mx-auto grid max-w-[1380px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ViewportReveal
          className="relative min-h-[520px] overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#dbcdbd,#cbb89d)] shadow-[0_14px_36px_rgba(72,49,30,0.08)]"
          distance={36}
          duration={560}
        >
          {preview?.renderEditable({
            fieldId: "aboutImage",
            label: "About image",
            children: (
              <div className="relative h-full w-full luxe-panel-float">
                <span className="pointer-events-none absolute left-[-6%] top-[12%] h-44 w-44 rounded-full bg-white/32 blur-[68px] luxe-atmosphere luxe-atmosphere-delay-1" />
                <span className="pointer-events-none absolute right-[-10%] bottom-[10%] h-40 w-40 rounded-full bg-[#ecdcc8]/34 blur-[72px] luxe-atmosphere luxe-atmosphere-delay-3" />
                <span className="pointer-events-none absolute inset-x-[16%] top-[14%] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.86),rgba(255,255,255,0))] luxe-line-pulse" />
                <span className="ambient-orb left-8 top-8 h-24 w-24 bg-white/24" />
                <span className="ambient-orb bottom-8 right-8 h-20 w-20 bg-brown/10 [animation-delay:1s]" />
                <div className="h-full w-full about-image-drift">
                  {siteSettings.aboutImageUrl ? (
                    <img
                      src={siteSettings.aboutImageUrl}
                      alt={siteSettings.aboutImageAlt || siteSettings.brandName}
                      className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-[1.04] hover:-translate-y-1"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-[linear-gradient(180deg,rgba(93,61,39,0.05),rgba(93,61,39,0.28)),radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_28%),linear-gradient(135deg,#d9cab7_0%,#bea887_100%)]" />
                  )}
                </div>
              </div>
            ),
            className: "block h-full w-full",
          }) ?? (
            <div className="relative h-full w-full luxe-panel-float">
              <span className="pointer-events-none absolute left-[-6%] top-[12%] h-44 w-44 rounded-full bg-white/32 blur-[68px] luxe-atmosphere luxe-atmosphere-delay-1" />
              <span className="pointer-events-none absolute right-[-10%] bottom-[10%] h-40 w-40 rounded-full bg-[#ecdcc8]/34 blur-[72px] luxe-atmosphere luxe-atmosphere-delay-3" />
              <span className="pointer-events-none absolute inset-x-[16%] top-[14%] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.86),rgba(255,255,255,0))] luxe-line-pulse" />
              <span className="ambient-orb left-8 top-8 h-24 w-24 bg-white/24" />
              <span className="ambient-orb bottom-8 right-8 h-20 w-20 bg-brown/10 [animation-delay:1s]" />
              <div className="h-full w-full about-image-drift">
                {siteSettings.aboutImageUrl ? (
                  <img
                    src={siteSettings.aboutImageUrl}
                    alt={siteSettings.aboutImageAlt || siteSettings.brandName}
                    className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-[1.04] hover:-translate-y-1"
                  />
                ) : (
                  <div className="relative h-full w-full bg-[linear-gradient(180deg,rgba(93,61,39,0.05),rgba(93,61,39,0.28)),radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_28%),linear-gradient(135deg,#d9cab7_0%,#bea887_100%)]" />
                )}
              </div>
            </div>
          )}
        </ViewportReveal>

        <ViewportReveal
          className="relative flex flex-col justify-center rounded-[32px] border border-brown/8 bg-[linear-gradient(135deg,rgba(255,252,247,0.86),rgba(239,228,215,0.92))] p-8 shadow-[0_14px_36px_rgba(72,49,30,0.08)] md:p-12"
          delay={90}
          distance={30}
          duration={560}
        >
          <div className="relative luxe-panel-float luxe-panel-float-delay-2">
            <span className="pointer-events-none absolute right-[-8%] top-[12%] h-36 w-36 rounded-full bg-white/30 blur-[64px] luxe-atmosphere luxe-atmosphere-delay-2" />
            <span className="pointer-events-none absolute left-[10%] top-[17%] h-px w-[34%] bg-[linear-gradient(90deg,rgba(167,127,88,0),rgba(167,127,88,0.78),rgba(167,127,88,0))] luxe-line-pulse" />
            <span className="ambient-orb right-10 top-8 h-16 w-16 bg-olive/12 [animation-delay:1.6s]" />
            <p className="mb-4 text-[12px] uppercase tracking-[0.2em] text-olive luxe-heading-glide">
              {preview?.renderEditable({
                fieldId: "aboutSubtitle",
                label: "About subtitle",
                children: <span>{content.subtitle}</span>,
                className: "w-fit",
              }) ?? content.subtitle}
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.96] text-dark md:text-[4.6rem] luxe-heading-glide">
              {preview?.renderEditable({
                fieldId: "aboutTitleLine1",
                label: "About line 1",
                children: <span>{content.title.line1}</span>,
                className: "block w-fit",
              }) ?? content.title.line1}
              <br />
              {preview?.renderEditable({
                fieldId: "aboutTitleLine2",
                label: "About line 2",
                children: <span>{content.title.line2}</span>,
                className: "block w-fit",
              }) ?? content.title.line2}
            </h2>
            {preview?.renderEditable({
              fieldId: "aboutDescription",
              label: "About description",
              children: <p className="mb-5 mt-6 text-[15px] leading-[1.95] text-muted">{content.description}</p>,
              className: "block",
            }) ?? <p className="mb-5 mt-6 text-[15px] leading-[1.95] text-muted">{content.description}</p>}
            <div className="mb-7 flex flex-wrap gap-3">
              {content.chips.map((chip, index) => (
                <ViewportReveal
                  key={chip}
                  as="span"
                  delay={160 + index * 70}
                  distance={14}
                  duration={420}
                  className="rounded-full border border-brown/10 bg-white/65 px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-[#5d3d27]"
                >
                  {chip}
                </ViewportReveal>
              ))}
            </div>
            {preview?.renderEditable({
              fieldId: "aboutButtonLabel",
              label: "About button",
              children: <span className="inline-flex items-center gap-[10px] rounded-full border border-transparent bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-6 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_10px_22px_rgba(72,49,30,0.06)]">{content.buttonLabel}</span>,
              className: "w-fit",
            }) ?? <Button variant="primary">{content.buttonLabel}</Button>}
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}
