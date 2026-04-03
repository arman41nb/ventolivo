import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import StripBanner from "@/components/sections/StripBanner";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getSiteContentSettings } from "@/modules/site-content";
import { getFeaturedProducts } from "@/services/products";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [dict, featured, siteSettings] = await Promise.all([
    getDictionary(currentLocale),
    getFeaturedProducts(4, currentLocale),
    getSiteContentSettings(currentLocale),
  ]);

  return (
    <>
      <Navbar dict={dict} locale={currentLocale} siteSettings={siteSettings} />
      <Hero dict={dict} locale={currentLocale} siteSettings={siteSettings} />
      <StripBanner dict={dict} siteSettings={siteSettings} />
      <FeaturedProducts
        products={featured}
        title={
          siteSettings.featuredProductsTitle || dict.featuredProducts.title
        }
        viewAllLabel={
          siteSettings.featuredProductsViewAllLabel ||
          dict.featuredProducts.viewAll
        }
        orderLabel={dict.products.card.orderVia}
        locale={currentLocale}
      />
      <AboutSection dict={dict} siteSettings={siteSettings} />
      <FeaturesGrid dict={dict} siteSettings={siteSettings} />
      <CTASection dict={dict} siteSettings={siteSettings} />
      <Footer dict={dict} siteSettings={siteSettings} />
    </>
  );
}
