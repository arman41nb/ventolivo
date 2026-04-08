import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import SoapStorySection from "@/components/sections/SoapStorySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getSiteContentSettings, getSiteLocales } from "@/modules/site-content";
import { getFeaturedProducts } from "@/services/products";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const [dict, featured, siteSettings, supportedLocales] = await Promise.all([
    getDictionary(currentLocale),
    getFeaturedProducts(4, currentLocale),
    getSiteContentSettings(currentLocale),
    getSiteLocales(),
  ]);

  return (
    <div className="page-shell min-h-screen">
      <Navbar
        dict={dict}
        locale={currentLocale}
        siteSettings={siteSettings}
        supportedLocales={supportedLocales}
      />
      <main>
        <Hero dict={dict} locale={currentLocale} siteSettings={siteSettings} />
        <SoapStorySection dict={dict} siteSettings={siteSettings} />
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
      </main>
      <Footer dict={dict} siteSettings={siteSettings} locale={currentLocale} />
    </div>
  );
}
