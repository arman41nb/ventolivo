import type { ReactNode } from "react";
import { buildWhatsAppLink } from "@/lib/utils";
import ViewportReveal from "@/components/animation/ViewportReveal";
import type { StorefrontContent } from "@/modules/site-content";
import type { StorefrontPreviewBindings } from "@/types";

interface CTASectionProps {
  content: StorefrontContent["cta"];
  preview?: StorefrontPreviewBindings;
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

export default function CTASection({ content, preview }: CTASectionProps) {
  const whatsappLink = buildWhatsAppLink("");

  return (
    <section id="contact" className="px-4 py-20 md:px-6">
      <div className="mx-auto grid max-w-[1380px] gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <ViewportReveal
          className="theme-card-surface relative overflow-hidden rounded-[32px] border border-brown/8 p-8 md:p-10"
          distance={28}
          duration={540}
        >
          <div className="relative luxe-panel-float">
            <span className="pointer-events-none absolute left-[-8%] top-[12%] h-40 w-40 rounded-full bg-white/26 blur-[64px] luxe-atmosphere luxe-atmosphere-delay-1" />
            <span className="pointer-events-none absolute inset-x-[18%] top-[18%] h-px bg-[linear-gradient(90deg,rgba(167,127,88,0),rgba(167,127,88,0.58),rgba(167,127,88,0))] luxe-line-pulse" />
            <div className="theme-quote-accent font-serif text-[5rem] leading-[0.7]">&quot;</div>
            {renderEditable(
              preview,
              "storyClosing",
              "CTA quote",
              <p className="mt-2 font-serif text-[2rem] leading-[1.08] text-brown md:text-[2.35rem] luxe-heading-glide">
                {content.quote}
              </p>,
              "block",
            )}
          </div>
        </ViewportReveal>

        <ViewportReveal
          className="theme-panel-surface relative overflow-hidden rounded-[32px] border border-brown/8 p-8 md:p-10"
          delay={80}
          distance={32}
          duration={560}
        >
          <div className="relative luxe-panel-float luxe-panel-float-delay-2">
            <span className="pointer-events-none absolute right-[-8%] top-[6%] h-44 w-44 rounded-full bg-white/30 blur-[68px] luxe-atmosphere luxe-atmosphere-delay-2" />
            <span className="pointer-events-none absolute left-[10%] top-[18%] h-px w-[34%] bg-[linear-gradient(90deg,rgba(124,140,94,0),rgba(124,140,94,0.62),rgba(124,140,94,0))] luxe-line-pulse" />
            <span className="ambient-orb right-10 top-8 h-20 w-20 bg-white/26" />
            {renderEditable(
              preview,
              "navbarLinkContact",
              "CTA eyebrow",
              <div className="mb-3 text-[12px] uppercase tracking-[0.2em] text-olive luxe-heading-glide">
                {content.eyebrow}
              </div>,
              "block w-fit",
            )}
            <h2 className="font-serif text-[2.8rem] leading-[0.96] text-dark md:text-[4rem] luxe-heading-glide">
              {renderEditable(
                preview,
                "ctaTitleLine1",
                "CTA line 1",
                <span>{content.title.line1}</span>,
                "block w-fit",
              )}
              <br />
              {renderEditable(
                preview,
                "ctaTitleLine2",
                "CTA line 2",
                <em className="theme-quote-accent font-medium italic">{content.title.line2}</em>,
                "block w-fit",
              )}
            </h2>
            {renderEditable(
              preview,
              "ctaDescription",
              "CTA description",
              <p className="mb-6 mt-4 max-w-[580px] text-[15px] leading-[1.9] text-muted">
                {content.description}
              </p>,
              "block max-w-[580px]",
            )}
            {preview ? (
              renderEditable(
                preview,
                "ctaButtonLabel",
                "CTA button",
                <span className="theme-primary-button inline-flex items-center gap-[10px] rounded-full px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {content.buttonLabel}
                </span>,
                "w-fit",
              )
            ) : (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-primary-button inline-flex items-center gap-[10px] rounded-full px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5 no-underline"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {content.buttonLabel}
              </a>
            )}
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}
