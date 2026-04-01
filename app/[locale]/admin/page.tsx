import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { getAllProducts, getFeaturedProducts } from "@/services/products";
import { logoutAdminAction } from "./actions";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const [products, featuredProducts] = await Promise.all([
    getAllProducts(locale),
    getFeaturedProducts(4, locale),
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f2e9_0%,#efe3d1_100%)] px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-[28px] border border-brown/15 bg-white/80 p-8 backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                {dictionary.admin.badge}
              </p>
              <h1 className="mt-3 font-serif text-5xl leading-none text-dark">
                {dictionary.admin.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-text/80">
                {dictionary.admin.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/admin/products`}
                className="rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
              >
                {dictionary.admin.dashboard.productManager}
              </Link>
              <form action={logoutAdminAction}>
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="rounded-full border border-brown/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                >
                  {dictionary.admin.dashboard.logout}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="rounded-[24px] border border-brown/10 bg-white p-6">
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {dictionary.admin.dashboard.stats.products}
            </p>
            <p className="mt-3 font-serif text-4xl text-dark">{products.length}</p>
          </article>
          <article className="rounded-[24px] border border-brown/10 bg-white p-6">
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {dictionary.admin.dashboard.stats.featured}
            </p>
            <p className="mt-3 font-serif text-4xl text-dark">
              {featuredProducts.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-brown/10 bg-white p-6">
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {dictionary.admin.dataSourceLabel}
            </p>
            <p className="mt-3 font-serif text-3xl text-dark">
              {env.PRODUCTS_DATA_SOURCE}
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <article className="rounded-[28px] border border-brown/10 bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                  {dictionary.admin.dashboard.recentProductsBadge}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-dark">
                  {dictionary.admin.dashboard.recentProductsTitle}
                </h2>
              </div>
              <Link
                href={`/${locale}/admin/products`}
                className="text-sm text-brown underline-offset-4 hover:underline"
              >
                {dictionary.admin.dashboard.openProductManager}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-[20px] border border-brown/10 bg-cream/35 px-4 py-4"
                >
                  <div>
                    <p className="font-serif text-2xl text-dark">{product.name}</p>
                    <p className="text-sm text-text/70">{product.tag}</p>
                  </div>
                  <span className="rounded-full bg-brown/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown">
                    /products/{product.slug}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-brown/10 bg-white p-8">
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
              {dictionary.admin.dashboard.roadmapBadge}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              {dictionary.admin.dashboard.roadmapTitle}
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm text-text/80">
              {dictionary.admin.dashboard.roadmapItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
