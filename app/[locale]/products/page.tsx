import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import { getSiteContentSettings, getSiteLocales } from "@/modules/site-content";
import { getAllProducts } from "@/services/products";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [dict, products, siteSettings, supportedLocales] = await Promise.all([
    getDictionary(currentLocale),
    getAllProducts(currentLocale),
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
      <main className="px-4 py-10 md:px-6 md:py-14">
        <section className="mx-auto max-w-[1380px]">
          <div className="mesh-bg animate-rise relative overflow-hidden rounded-[38px] border border-brown/8 p-8 shadow-[0_20px_48px_rgba(72,49,30,0.08)] md:p-10">
            <span className="ambient-orb left-10 top-8 h-24 w-24 bg-white/28" />
            <span className="ambient-orb bottom-8 right-10 h-20 w-20 bg-olive/12 [animation-delay:1.2s]" />
            <Badge className="mb-4">{dict.products.badge}</Badge>
            <h1 className="max-w-[820px] font-serif text-[3rem] leading-[0.95] text-dark md:text-[5rem]">
              {dict.products.title}
            </h1>
            <p className="mt-5 max-w-[640px] text-[15px] leading-[1.9] text-muted">
              {siteSettings.heroDescription ?? dict.hero.description}
            </p>
          </div>

          <div className="animate-rise animate-rise-delay-2 mt-8">
            <ProductGrid
              products={products}
              orderLabel={dict.products.card.orderVia}
              locale={currentLocale}
            />
          </div>
        </section>
      </main>
      <Footer dict={dict} siteSettings={siteSettings} locale={currentLocale} />
    </div>
  );
}
