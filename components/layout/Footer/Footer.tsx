import Link from "next/link";
import type { ReactNode } from "react";
import ViewportReveal from "@/components/animation/ViewportReveal";
import { socialLinks } from "@/config";
import type { Locale } from "@/i18n/config";
import type { StorefrontContent } from "@/modules/site-content";
import type { StorefrontPreviewBindings } from "@/types";

interface FooterProps {
  brandName: string;
  content: StorefrontContent["footer"];
  locale: Locale;
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

export default function Footer({ brandName, content, locale, preview }: FooterProps) {
  const homeHref = `/${locale}`;

  if (!preview) {
    return (
      <footer
        className="theme-footer-shell mt-8 px-4 py-10 text-cream md:px-6"
        role="contentinfo"
      >
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
            <ViewportReveal delay={0} distance={26} duration={520}>
              <Link
                href={homeHref}
                className="font-serif text-[2.4rem] text-cream no-underline"
                aria-label={brandName}
              >
                {brandName}
              </Link>
              <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-cream/75">
                {content.description}
              </p>
            </ViewportReveal>

            <ViewportReveal delay={70} distance={24} duration={500}>
              <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
                {content.links.products}
              </h5>
              <div className="grid gap-2 text-[14px] text-cream/75">
                <Link
                  href={`/${locale}/products`}
                  className="no-underline hover:text-white"
                >
                  {content.links.products}
                </Link>
                <Link href={`${homeHref}#about`} className="no-underline hover:text-white">
                  {content.links.about}
                </Link>
                <Link href={`${homeHref}#contact`} className="no-underline hover:text-white">
                  {content.links.contact}
                </Link>
              </div>
            </ViewportReveal>

            <ViewportReveal delay={130} distance={22} duration={500}>
              <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
                {content.links.about}
              </h5>
              <div className="grid gap-2 text-[14px] text-cream/75">
                {content.featureLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </ViewportReveal>

            <ViewportReveal delay={180} distance={20} duration={500}>
              <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">Social</h5>
              <nav className="grid gap-2 text-[14px] text-cream/75" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:text-white"
                    aria-label={`${link.label} (opens in new tab)`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </ViewportReveal>
          </div>

          <ViewportReveal
            className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-cream/65"
            delay={90}
            distance={18}
            duration={460}
          >
            <p>
              &copy; {new Date().getFullYear()} {brandName}. {content.copyright}
            </p>
            <p>Designed for a premium handmade care brand.</p>
          </ViewportReveal>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="theme-footer-shell mt-8 px-4 py-10 text-cream md:px-6"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <ViewportReveal delay={0} distance={26} duration={520}>
            {preview ? (
              renderEditable(
                preview,
                "brandName",
                "Brand name",
                <span className="font-serif text-[2.4rem] text-cream">{brandName}</span>,
                "w-fit",
              )
            ) : (
              <Link
                href={homeHref}
                className="font-serif text-[2.4rem] text-cream no-underline"
                aria-label={brandName}
              >
                {brandName}
              </Link>
            )}
            {renderEditable(
              preview,
              "heroDescription",
              "Footer description",
              <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-cream/75">
                {content.description}
              </p>,
              "block max-w-[420px]",
            )}
          </ViewportReveal>

          <ViewportReveal delay={70} distance={24} duration={500}>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
              {content.links.products}
            </h5>
            <div className="grid gap-2 text-[14px] text-cream/75">
              {renderEditable(
                preview,
                "navbarLinkProducts",
                "Footer products link",
                <span>{content.links.products}</span>,
              )}
              {renderEditable(
                preview,
                "navbarLinkAbout",
                "Footer about link",
                <span>{content.links.about}</span>,
              )}
              {renderEditable(
                preview,
                "navbarLinkContact",
                "Footer contact link",
                <span>{content.links.contact}</span>,
              )}
            </div>
          </ViewportReveal>

          <ViewportReveal delay={130} distance={22} duration={500}>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
              {content.links.about}
            </h5>
            <div className="grid gap-2 text-[14px] text-cream/75">
              {content.featureLabels.map((label, index) => (
                <span key={label}>
                  {renderEditable(
                    preview,
                    index === 0 ? "navbarLinkProducts" : index === 1 ? "aboutSubtitle" : "ctaButtonLabel",
                    "Footer feature label",
                    <span>{label}</span>,
                  )}
                </span>
              ))}
            </div>
          </ViewportReveal>

          <ViewportReveal delay={180} distance={20} duration={500}>
            <h5 className="mb-3 text-[13px] uppercase tracking-[0.18em] text-white">
              {brandName}
            </h5>
            <nav className="grid gap-2 text-[14px] text-cream/75" aria-label={brandName}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:text-white"
                  aria-label={link.label}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </ViewportReveal>
        </div>

        <ViewportReveal
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-cream/65"
          delay={90}
          distance={18}
          duration={460}
        >
          {renderEditable(
            preview,
            "footerCopyrightText",
            "Footer copyright",
            <p>
              &copy; {new Date().getFullYear()} {brandName}. {content.copyright}
            </p>,
            "block",
          )}
        </ViewportReveal>
      </div>
    </footer>
  );
}
