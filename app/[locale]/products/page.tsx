import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { getAllProducts } from "@/services/products";
import { getCustomerSession } from "@/services/customer-auth";
import { getStorefrontData } from "@/services/storefront";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, products, customerSession] = await Promise.all([
    getStorefrontData(currentLocale),
    getAllProducts(currentLocale),
    getCustomerSession(),
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
          <div className="mesh-bg animate-rise relative overflow-hidden rounded-[38px] border border-brown/8 p-8 shadow-[0_20px_48px_rgba(72,49,30,0.08)] md:p-10">
            <span className="ambient-orb left-10 top-8 h-24 w-24 bg-white/28" />
            <span className="ambient-orb bottom-8 right-10 h-20 w-20 bg-olive/12 [animation-delay:1.2s]" />
            <Badge className="mb-4">{content.products.badge}</Badge>
            <h1 className="max-w-[820px] font-serif text-[3rem] leading-[0.95] text-dark md:text-[5rem]">
              {content.products.title}
            </h1>
            <p className="mt-5 max-w-[640px] text-[15px] leading-[1.9] text-muted">
              {content.hero.description}
            </p>
          </div>

          <div className="animate-rise animate-rise-delay-2 mt-8">
            <ProductGrid products={products} orderLabel={content.products.orderLabel} locale={currentLocale} />
          </div>
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={currentLocale} />
    </StorefrontThemeScope>
  );
}
