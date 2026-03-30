import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import StripBanner from "@/components/sections/StripBanner";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getFeaturedProducts } from "@/services/products";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const dict = await getDictionary(currentLocale);
  const featured = getFeaturedProducts(4);

  return (
    <>
      <Navbar dict={dict} locale={currentLocale} />
      <Hero dict={dict} locale={currentLocale} />
      <StripBanner dict={dict} />
      <FeaturedProducts
        products={featured}
        title={dict.featuredProducts.title}
        viewAllLabel={dict.featuredProducts.viewAll}
        orderLabel={dict.products.card.orderVia}
        locale={currentLocale}
      />
      <AboutSection dict={dict} />
      <FeaturesGrid dict={dict} />
      <CTASection dict={dict} />
      <Footer dict={dict} />
    </>
  );
}
