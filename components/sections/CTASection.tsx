import { buildWhatsAppLink } from "@/lib/utils";
import ViewportReveal from "@/components/animation/ViewportReveal";
import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface CTASectionProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

export default function CTASection({ dict, siteSettings }: CTASectionProps) {
  const title = {
    line1: siteSettings?.ctaTitleLine1 ?? dict?.cta.title.line1 ?? "Ready to order?",
    line2: siteSettings?.ctaTitleLine2 ?? dict?.cta.title.line2 ?? "We'd love to hear from you.",
  };
  const description =
    siteSettings?.ctaDescription ??
    dict?.cta.description ??
    "Send us a message and we'll get back to you within hours";
  const button = siteSettings?.ctaButtonLabel ?? dict?.cta.button ?? "Order on WhatsApp";
  const whatsappLink = buildWhatsAppLink("");
  const quote =
    siteSettings?.aboutDescription ??
    dict?.about.description ??
    description;

  return (
    <section
      id="contact"
      className="px-4 py-20 md:px-6"
    >
      <div className="mx-auto grid max-w-[1380px] gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <ViewportReveal
          className="rounded-[32px] border border-brown/8 bg-[rgba(255,251,246,0.75)] p-8 shadow-[0_14px_32px_rgba(72,49,30,0.08)] md:p-10"
          distance={28}
          duration={540}
        >
          <div className="font-serif text-[5rem] leading-[0.7] text-[#a77f58]">&quot;</div>
          <p className="mt-2 font-serif text-[2rem] leading-[1.08] text-[#5d3d27] md:text-[2.35rem]">
            {quote}
          </p>
        </ViewportReveal>

        <ViewportReveal
          className="relative rounded-[32px] border border-brown/8 bg-[radial-gradient(circle_at_top_right,rgba(167,127,88,0.12),transparent_26%),linear-gradient(135deg,rgba(255,252,247,0.88),rgba(239,228,215,0.92))] p-8 shadow-[0_14px_32px_rgba(72,49,30,0.08)] md:p-10"
          delay={80}
          distance={32}
          duration={560}
        >
          <span className="ambient-orb right-10 top-8 h-20 w-20 bg-white/26" />
          <div className="mb-3 text-[12px] uppercase tracking-[0.2em] text-olive">
            {dict?.navbar.links.contact ?? "Contact"}
          </div>
          <h2 className="font-serif text-[2.8rem] leading-[0.96] text-dark md:text-[4rem]">
            {title.line1}
            <br />
            <em className="font-medium italic text-[#a77f58]">{title.line2}</em>
          </h2>
          <p className="mb-6 mt-4 max-w-[580px] text-[15px] leading-[1.9] text-muted">
            {description}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[10px] rounded-full bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(93,61,39,0.18)] transition-transform hover:-translate-y-0.5 no-underline"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {button}
          </a>
        </ViewportReveal>
      </div>
    </section>
  );
}
