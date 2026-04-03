import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import { getProductBySlug } from "@/services/products";
import { getDictionary } from "@/i18n";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getSiteContentSettings } from "@/modules/site-content";
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
    openGraph: getPrimaryProductMedia(product)?.type === "image"
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
  const [dict, product, siteSettings] = await Promise.all([
    getDictionary(currentLocale),
    getProductBySlug(slug, currentLocale),
    getSiteContentSettings(currentLocale),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar dict={dict} locale={currentLocale} siteSettings={siteSettings} />
      <section className="px-[2.5rem] py-[4rem]">
        <ProductDetail
          product={product}
          orderLabel={dict.products.card.orderVia}
        />
      </section>
      <Footer dict={dict} siteSettings={siteSettings} />
    </>
  );
}
