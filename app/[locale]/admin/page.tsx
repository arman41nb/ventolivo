import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import {
  getAdminSession,
  getRecentAdminAuditLogEntries,
} from "@/modules/admin-auth/server";
import { getAdminSessionRecoveryPath } from "@/modules/admin-auth/navigation";
import { getAllProducts, getFeaturedProducts } from "@/services/products";

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
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    getAdminSession(),
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin`,
      }),
    );
  }

  const [products, featuredProducts, activity] = await Promise.all([
    getAllProducts(locale),
    getFeaturedProducts(4, locale),
    getRecentAdminAuditLogEntries(6),
  ]);

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.title}
      description={dictionary.admin.description}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={[
        { href: `/${locale}/admin`, label: "Dashboard", active: true },
        { href: `/${locale}/admin/products`, label: "Products" },
        { href: `/${locale}/admin/media`, label: "Library" },
        { href: `/${locale}/admin/site`, label: "Site content" },
      ]}
      primaryAction={{
        href: `/${locale}/admin/products`,
        label: dictionary.admin.dashboard.productManager,
      }}
    >
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
        <section className="rounded-[28px] border border-brown/10 bg-white p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
                {dictionary.admin.dashboard.activityBadge}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">
                {dictionary.admin.dashboard.activityTitle}
              </h2>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-[22px] border border-brown/10 bg-cream/35 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-dark">
                    {entry.actorLabel} · {entry.action}
                  </p>
                  <p className="mt-1 text-sm text-text/70">
                    {entry.metadata ?? dictionary.admin.dashboard.activityFallback}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.14em] text-muted">
                  {entry.createdAt.toLocaleString(locale)}
                </span>
              </div>
            ))}
          </div>
        </section>
    </AdminShell>
  );
}
