import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { getProductBySlug } from "@/services/products";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getStorefrontData } from "@/services/storefront";
import { getCustomerSession } from "@/services/customer-auth";
import { getPrimaryProductMedia } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = isValidLocale(locale) ? (locale as Locale) : undefined;
  const product = await getProductBySlug(slug, resolvedLocale);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph:
      getPrimaryProductMedia(product)?.type === "image"
        ? { images: [{ url: getPrimaryProductMedia(product)!.url }] }
        : undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const currentLocale = rawLocale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, product, customerSession] = await Promise.all([
    getStorefrontData(currentLocale),
    getProductBySlug(slug, currentLocale),
    getCustomerSession(),
  ]);

  if (!product) {
    notFound();
  }

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
          <ProductDetail
            product={product}
            orderLabel={content.products.orderLabel}
            ingredientsLabel={content.products.ingredientsLabel}
            locale={currentLocale}
          />
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={currentLocale} />
    </StorefrontThemeScope>
  );
}
