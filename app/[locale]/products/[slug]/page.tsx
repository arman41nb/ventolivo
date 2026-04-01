import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import { getProductBySlug } from "@/services/products";
import { getDictionary } from "@/i18n";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";

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
  const dict = await getDictionary(currentLocale);
  const product = await getProductBySlug(slug, currentLocale);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar dict={dict} locale={currentLocale} />
      <section className="px-[2.5rem] py-[4rem]">
        <ProductDetail
          product={product}
          orderLabel={dict.products.card.orderVia}
        />
      </section>
      <Footer dict={dict} />
    </>
  );
}
