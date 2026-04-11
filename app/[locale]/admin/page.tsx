import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import {
  buildAdminFocusItems,
  buildAdminMediaInsights,
  buildAdminProductInsights,
} from "@/modules/admin/insights";
import {
  getAdminSession,
  getAdminSessionRecoveryPath,
  getRecentAdminAuditLogEntries,
} from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getAllMediaAssets } from "@/services/media";
import { getAllProducts, getFeaturedProducts } from "@/services/products";
import { getSiteLocales } from "@/services/site-content";

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
  const [dictionary, session] = await Promise.all([getDictionary(locale), getAdminSession()]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin`,
      }),
    );
  }

  const [products, featuredProducts, activity, mediaAssets, siteLocales] = await Promise.all([
    getAllProducts(locale),
    getFeaturedProducts(4, locale),
    getRecentAdminAuditLogEntries(6),
    getAllMediaAssets(),
    getSiteLocales(),
  ]);
  const productInsights = buildAdminProductInsights(products, siteLocales);
  const mediaInsights = buildAdminMediaInsights(mediaAssets, products);
  const focusItems = buildAdminFocusItems({
    productInsights,
    mediaInsights,
    locales: siteLocales,
  });
  const recentProducts = products.slice(0, 5);
  const lastActivity = activity[0];
  const latestProduct = recentProducts[0];
  const dashboardCards = [
    {
      label: dictionary.admin.dashboard.stats.products,
      value: products.length.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(239,228,215,0.95))]",
    },
    {
      label: dictionary.admin.dashboard.stats.featured,
      value: featuredProducts.length.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(223,229,212,0.72),rgba(255,255,255,0.94))]",
    },
    {
      label: dictionary.admin.dataSourceLabel,
      value: env.PRODUCTS_DATA_SOURCE.toUpperCase(),
      accent: "bg-[linear-gradient(135deg,rgba(122,86,56,0.12),rgba(255,255,255,0.94))]",
    },
    {
      label: "Media assets",
      value: mediaInsights.totalAssets.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(218,208,195,0.42),rgba(255,255,255,0.94))]",
    },
  ];

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
      navItems={getAdminNavItems(locale, "dashboard", dictionary.admin.navigation)}
      primaryAction={{
        href: `/${locale}/admin/products`,
        label: dictionary.admin.dashboard.productManager,
      }}
      secondaryAction={{
        href: `/${locale}/admin/register`,
        label: dictionary.admin.dashboard.manageAccess,
      }}
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.22fr)_380px]">
        <article className="relative overflow-hidden rounded-[36px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,250,244,0.84),rgba(239,228,215,0.92)_56%,rgba(216,202,184,0.92)_100%)] p-7 shadow-[0_28px_64px_rgba(107,79,58,0.14)] md:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_60%)] lg:block" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-white/35 blur-3xl" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/72 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
              <span className="h-2 w-2 rounded-full bg-olive" />
              {dictionary.admin.dashboard.activityBadge}
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.94] text-dark md:text-6xl">
              {products.length} {dictionary.admin.dashboard.stats.products}
            </h2>
            <p className="mt-3 max-w-2xl font-serif text-3xl leading-none text-brown/82 md:text-4xl">
              {featuredProducts.length} {dictionary.admin.dashboard.stats.featured}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-text/78 md:text-[15px]">
              {dictionary.admin.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/admin/products`}
                className="rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-5 py-3 text-xs uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(107,79,58,0.16)] transition-transform hover:-translate-y-0.5"
              >
                {dictionary.admin.dashboard.productManager}
              </Link>
              <Link
                href={`/${locale}/admin/site`}
                className="rounded-full border border-brown/12 bg-white/75 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                {dictionary.admin.navigation.siteContent}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {dashboardCards.map((card) => (
                <article
                  key={card.label}
                  className={`rounded-[24px] border border-white/45 p-5 shadow-[0_16px_30px_rgba(107,79,58,0.08)] ${card.accent}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{card.label}</p>
                  <p className="mt-4 font-serif text-4xl leading-none text-dark">{card.value}</p>
                </article>
              ))}
            </div>
          </div>
        </article>

        <article className="grid gap-4">
          <div className="rounded-[30px] border border-white/55 bg-white/82 p-6 shadow-[0_24px_48px_rgba(107,79,58,0.1)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {dictionary.admin.dashboard.activityTitle}
            </p>
            <h3 className="mt-4 font-serif text-3xl text-dark">
              {lastActivity ? lastActivity.actorLabel : "Ventolivo"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-text/74">
              {lastActivity?.metadata ?? dictionary.admin.dashboard.activityFallback}
            </p>
            <p className="mt-5 inline-flex rounded-full border border-brown/10 bg-cream/60 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
              {lastActivity
                ? lastActivity.createdAt.toLocaleString(locale)
                : dictionary.admin.dashboard.activityFallback}
            </p>
          </div>

          <div className="rounded-[30px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(245,240,232,0.9))] p-6 shadow-[0_22px_44px_rgba(107,79,58,0.08)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {dictionary.admin.dashboard.openProductManager}
            </p>
            <h3 className="mt-4 font-serif text-3xl text-dark">
              {latestProduct?.name ?? dictionary.admin.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-text/74">
              {dictionary.admin.inventory.managerDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-brown/10 bg-white/75 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                {latestProduct ? `/products/${latestProduct.slug}` : `/${locale}/admin/products`}
              </span>
              <Link
                href={`/${locale}/admin/products`}
                className="rounded-full bg-brown px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
              >
                {dictionary.admin.dashboard.openProductManager}
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <article className="rounded-[34px] border border-white/55 bg-white/84 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8 xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Admin health</p>
              <h2 className="mt-3 font-serif text-4xl text-dark">Data, content, and library health</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-text/74">
                This layer surfaces the parts of the admin that still need attention so we are not
                editing blind: translation coverage, product media readiness, and unused library
                assets.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-brown/10 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown/70">
                {siteLocales.length} locales
              </span>
              <span className="rounded-full border border-brown/10 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown/70">
                {productInsights.totalMissingTranslationLocales} missing locale slots
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {focusItems.map((item) => (
              <article
                key={item.id}
                className={`rounded-[28px] border p-5 shadow-[0_16px_30px_rgba(107,79,58,0.06)] ${
                  item.tone === "success"
                    ? "border-olive/20 bg-[linear-gradient(180deg,rgba(124,140,94,0.12),rgba(255,255,255,0.9))]"
                    : item.tone === "warning"
                      ? "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),rgba(255,255,255,0.92))]"
                      : "border-red-500/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(255,255,255,0.92))]"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{item.label}</p>
                <p className="mt-4 font-serif text-4xl text-dark">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-text/72">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-[24px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,252,247,0.78),rgba(239,228,215,0.72))] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Localized products</p>
              <p className="mt-3 font-serif text-3xl text-dark">{productInsights.fullyLocalizedProducts}</p>
            </div>
            <div className="rounded-[24px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,252,247,0.78),rgba(239,228,215,0.72))] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Products with cover</p>
              <p className="mt-3 font-serif text-3xl text-dark">{productInsights.productsWithCover}</p>
            </div>
            <div className="rounded-[24px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,252,247,0.78),rgba(239,228,215,0.72))] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Gallery ready</p>
              <p className="mt-3 font-serif text-3xl text-dark">{productInsights.productsWithGallery}</p>
            </div>
            <div className="rounded-[24px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,252,247,0.78),rgba(239,228,215,0.72))] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Unused assets</p>
              <p className="mt-3 font-serif text-3xl text-dark">{mediaInsights.unusedAssets}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[34px] border border-white/55 bg-white/84 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                {dictionary.admin.dashboard.recentProductsBadge}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-dark">
                {dictionary.admin.dashboard.recentProductsTitle}
              </h2>
            </div>
            <Link
              href={`/${locale}/admin/products`}
              className="inline-flex rounded-full border border-brown/12 bg-white/78 px-4 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
            >
              {dictionary.admin.dashboard.openProductManager}
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {recentProducts.map((product, index) => (
              <article
                key={product.id}
                className="grid gap-4 rounded-[28px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.72),rgba(239,228,215,0.82))] p-5 md:grid-cols-[84px_minmax(0,1fr)_auto] md:items-center"
              >
                <div className="grid h-[84px] w-[84px] place-items-center rounded-[26px] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(223,229,212,0.66))] font-serif text-3xl text-dark shadow-[0_14px_28px_rgba(107,79,58,0.08)]">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="truncate font-serif text-3xl text-dark">{product.name}</h3>
                    <span className="rounded-full bg-white/75 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown/72">
                      {product.tag}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-text/72">
                    {product.description}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-brown/55">
                    /products/{product.slug}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <Link
                    href={`/${locale}/admin/products/${product.id}`}
                    className="rounded-full bg-olive px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                  >
                    {dictionary.admin.inventory.edit}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[34px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(232,221,208,0.72))] p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            {dictionary.admin.dashboard.activityTitle}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-dark">
            {dictionary.admin.dashboard.activityTitle}
          </h2>
          <div className="mt-6 grid gap-4">
            {activity.map((entry, index) => (
              <div
                key={entry.id}
                className="rounded-[26px] border border-brown/10 bg-white/76 p-5 backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-[16px] bg-[linear-gradient(135deg,rgba(124,140,94,0.18),rgba(107,79,58,0.14))] text-[11px] uppercase tracking-[0.16em] text-brown/70">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-dark">
                        {entry.actorLabel} / {entry.action}
                      </p>
                      <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-olive/70" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text/72">
                      {entry.metadata ?? dictionary.admin.dashboard.activityFallback}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-brown/55">
                      {entry.createdAt.toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
