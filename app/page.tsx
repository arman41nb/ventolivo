import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import StripBanner from "@/components/sections/StripBanner";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getFeaturedProducts } from "@/services/products";

export default function Home() {
  const featured = getFeaturedProducts(4);

  return (
    <>
      <Navbar />
      <Hero />
      <StripBanner />
      <FeaturedProducts products={featured} />
      <AboutSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </>
  );
}
