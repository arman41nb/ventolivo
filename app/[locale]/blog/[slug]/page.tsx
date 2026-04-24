import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getStorefrontData } from "@/services/storefront";
import { getCustomerSession } from "@/services/customer-auth";
import { getPublishedBlogPostBySlug } from "@/services/blog";
import { siteConfig } from "@/config";

function formatBlogDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

function estimateReadingTime(content: string): number {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function buildContentBlocks(content: string): Array<{ kind: "p" | "h2" | "li"; text: string }> {
  const lines = content.split("\n").map((line) => line.trim());
  const blocks: Array<{ kind: "p" | "h2" | "li"; text: string }> = [];

  for (const line of lines) {
    if (!line) {
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      blocks.push({ kind: "li", text: line.slice(2).trim() });
      continue;
    }

    blocks.push({ kind: "p", text: line });
  }

  return blocks;
}

function isRichHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) {
    return {};
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.summary;
  const path = `/${locale}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, customerSession, post] = await Promise.all([
    getStorefrontData(currentLocale),
    getCustomerSession(),
    getPublishedBlogPostBySlug(slug),
  ]);

  if (!post) {
    notFound();
  }

  const publishedAt = post.publishedAt ?? post.updatedAt;
  const canonicalUrl = `${siteConfig.url}/${currentLocale}/blog/${post.slug}`;
  const readingTime = estimateReadingTime(post.content);
  const blocks = buildContentBlocks(post.content);
  const richHtmlContent = isRichHtmlContent(post.content);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.summary,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString() || undefined,
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteConfig.url}/${currentLocale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/${currentLocale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

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
        <section className="mx-auto max-w-[980px]">
          <Link
            href={`/${currentLocale}/blog`}
            className="inline-flex text-[12px] uppercase tracking-[0.15em] text-brown no-underline transition-colors hover:text-dark"
          >
            &larr; Back to blog
          </Link>

          <article className="mt-6 rounded-[30px] border border-brown/8 bg-white/82 p-7 shadow-[0_20px_50px_rgba(72,49,30,0.08)] md:p-10">
            <header>
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-muted">
                <span>{formatBlogDate(publishedAt, currentLocale)}</span>
                <span>• {readingTime} min read</span>
                {post.tags.length > 0 ? <span>• {post.tags.join(" • ")}</span> : null}
              </div>
              <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.02] text-dark md:text-[3.5rem]">
                {post.title}
              </h1>
              <p className="mt-4 max-w-[820px] text-[16px] leading-[1.9] text-muted">{post.summary}</p>
            </header>

            {richHtmlContent ? (
              <div
                className="mt-8 space-y-4 text-[16px] leading-[1.95] text-dark/90 [&_h2]:pt-4 [&_h2]:font-serif [&_h2]:text-[1.8rem] [&_h2]:text-dark [&_h3]:pt-3 [&_h3]:font-serif [&_h3]:text-[1.4rem] [&_h3]:text-dark [&_img]:my-5 [&_img]:w-full [&_img]:rounded-[18px] [&_img]:border [&_img]:border-brown/12 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:my-3 [&_ul]:ml-5 [&_ul]:list-disc [&_video]:my-5 [&_video]:w-full [&_video]:rounded-[18px] [&_video]:border [&_video]:border-brown/15"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="mt-8 space-y-4 text-[16px] leading-[1.95] text-dark/90">
                {blocks.map((block, index) => {
                  if (block.kind === "h2") {
                    return (
                      <h2 key={`${block.kind}-${index}`} className="pt-4 font-serif text-[1.8rem] text-dark">
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.kind === "li") {
                    return (
                      <p key={`${block.kind}-${index}`} className="pl-4">
                        • {block.text}
                      </p>
                    );
                  }

                  return <p key={`${block.kind}-${index}`}>{block.text}</p>;
                })}
              </div>
            )}
          </article>
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={currentLocale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </StorefrontThemeScope>
  );
}

