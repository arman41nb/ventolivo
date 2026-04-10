import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import SoapStorySection from "@/components/sections/SoapStorySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getFeaturedProducts } from "@/services/products";
import { getStorefrontData } from "@/services/storefront";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [{ content, siteSettings, supportedLocales }, featured] = await Promise.all([
    getStorefrontData(currentLocale),
    getFeaturedProducts(4, currentLocale),
  ]);

  return (
    <div className="page-shell min-h-screen">
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
      />
      <main>
        <Hero locale={currentLocale} siteSettings={siteSettings} content={{ ...content.hero, ...content.features }} />
        <SoapStorySection siteSettings={siteSettings} content={content.storySection} />
        <FeaturedProducts
          products={featured}
          title={content.featuredProducts.title}
          viewAllLabel={content.featuredProducts.viewAllLabel}
          orderLabel={content.featuredProducts.orderLabel}
          locale={currentLocale}
        />
        <AboutSection siteSettings={siteSettings} content={content.about} />
        <FeaturesGrid content={content.features} />
        <CTASection content={content.cta} />
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={currentLocale} />
    </div>
  );
}
