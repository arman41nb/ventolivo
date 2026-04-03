import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import { getSiteContentSettings } from "@/modules/site-content";
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
  const [dict, products, siteSettings] = await Promise.all([
    getDictionary(currentLocale),
    getAllProducts(currentLocale),
    getSiteContentSettings(currentLocale),
  ]);

  return (
    <>
      <Navbar dict={dict} locale={currentLocale} siteSettings={siteSettings} />
      <section className="px-[2.5rem] py-[4rem]">
        <div className="mb-[2.5rem]">
          <Badge className="mb-[0.8rem] block">{dict.products.badge}</Badge>
          <h1 className="font-serif text-[48px] text-dark leading-[1.1]">
            {dict.products.title}
          </h1>
        </div>
        <ProductGrid products={products} orderLabel={dict.products.card.orderVia} locale={currentLocale} />
      </section>
      <Footer dict={dict} siteSettings={siteSettings} />
    </>
  );
}
