import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getStorefrontData } from "@/services/storefront";
import { getCustomerSession } from "@/services/customer-auth";
import { getPublishedBlogPosts } from "@/services/blog";
import { siteConfig } from "@/config";

function formatBlogDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const title = `Blog | ${siteConfig.name}`;
  const description = "Read practical guides about natural soap ingredients, routines, and artisan skincare habits.";
  const path = `/${locale}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, customerSession, posts] = await Promise.all([
    getStorefrontData(currentLocale),
    getCustomerSession(),
    getPublishedBlogPosts(),
  ]);

  return (
    <StorefrontThemeScope settings={siteSettings} className="page-shell min-h-screen">
      <Navbar
        locale={currentLocale}
        brand={{
          name: content.brandName,
          logoMode: siteSettings.logoMode,
          logoText: siteSettings.logoText,
          logoImageUrl: siteSettings.logoImageUrl,
          logoAltText: siteSettings.logoAltText,
        }}
        content={content.navbar}
        supportedLocales={supportedLocales}
        accountLabels={dictionary.account.nav}
        customerSession={
          customerSession
            ? {
                fullName: customerSession.user.fullName,
                avatarUrl: customerSession.user.avatarUrl,
              }
            : undefined
        }
      />
      <main className="px-4 py-10 md:px-6 md:py-14">
        <section className="mx-auto max-w-[1380px]">
          <div className="mesh-bg relative overflow-hidden rounded-[38px] border border-brown/8 p-8 shadow-[0_20px_48px_rgba(72,49,30,0.08)] md:p-10">
            <Badge className="mb-4">Editorial</Badge>
            <h1 className="max-w-[820px] font-serif text-[3rem] leading-[0.95] text-dark md:text-[5rem]">Blog</h1>
            <p className="mt-5 max-w-[700px] text-[15px] leading-[1.9] text-muted">
              Practical reading for ingredient transparency, better skincare rituals, and artisan soap know-how.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="mt-8 rounded-[26px] border border-brown/8 bg-white/80 p-8 text-muted">
              No published articles yet.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-[26px] border border-brown/8 bg-white/80 p-6 shadow-[0_14px_34px_rgba(72,49,30,0.08)]"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                    <span>{post.publishedAt ? formatBlogDate(post.publishedAt, currentLocale) : "Draft"}</span>
                    {post.tags.length > 0 ? <span>• {post.tags[0]}</span> : null}
                  </div>
                  <h2 className="font-serif text-[1.7rem] leading-tight text-dark">{post.title}</h2>
                  <p className="mt-4 text-[14px] leading-[1.9] text-muted">{post.summary}</p>
                  <Link
                    href={`/${currentLocale}/blog/${post.slug}`}
                    className="mt-5 inline-flex text-[12px] font-medium uppercase tracking-[0.15em] text-brown no-underline transition-colors hover:text-dark"
                  >
                    Read article &rarr;
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={currentLocale} />
    </StorefrontThemeScope>
  );
}

