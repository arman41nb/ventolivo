import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/modules/admin-auth";
import { getAdminNavItems } from "@/modules/admin/ui";
import { getAllProducts } from "@/modules/products";
import { deleteProductAction } from "./actions";

export default async function AdminProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; status?: string; q?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, { error, status, q }, session] = await Promise.all([
    getDictionary(locale),
    searchParams,
    getAdminSession(),
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/products`,
      }),
    );
  }

  const allProducts = await getAllProducts(locale);
  const isDatabaseMode = env.PRODUCTS_DATA_SOURCE === "database";
  const searchTerm = (q ?? "").trim().toLocaleLowerCase();
  const errorMessage = error === "slug-conflict" ? dictionary.admin.errors.slugConflict : null;
  const products = searchTerm
    ? allProducts.filter((product) =>
        [product.name, product.slug, product.tag]
          .join(" ")
          .toLocaleLowerCase()
          .includes(searchTerm),
      )
    : allProducts;
  const priceFormatter = new Intl.NumberFormat(locale);

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.inventory.title}
      description={dictionary.admin.inventory.managerDescription}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={getAdminNavItems(locale, "products", dictionary.admin.navigation)}
      primaryAction={{
        href: `/${locale}/admin/products/new`,
        label: dictionary.admin.create.submit,
      }}
      secondaryAction={{
        href: `/${locale}/admin`,
        label: dictionary.admin.inventory.backToDashboard,
      }}
    >
      <section className="relative overflow-hidden rounded-[34px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.84),rgba(239,228,215,0.92)_56%,rgba(255,255,255,0.88)_100%)] p-7 shadow-[0_24px_54px_rgba(107,79,58,0.1)] md:p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[32%] bg-[radial-gradient(circle_at_top,rgba(124,140,94,0.2),transparent_64%)] lg:block" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-white/35 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
              <span className="h-2 w-2 rounded-full bg-olive" />
              {dictionary.admin.inventory.catalogBadge}
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[0.94] text-dark md:text-5xl">
              {products.length}{" "}
              {products.length === 1
                ? dictionary.admin.inventory.visibleProducts
                : dictionary.admin.inventory.visibleProductsPlural}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text/78">
              {dictionary.admin.inventory.managerDescription}
            </p>

            <form className="mt-6">
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder={dictionary.admin.inventory.searchPlaceholder}
                className="w-full rounded-[20px] border border-brown/15 bg-white/80 px-5 py-4 text-sm outline-none transition-colors focus:border-brown"
              />
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              {status ? (
                <p className="inline-flex rounded-full border border-olive/15 bg-olive/10 px-4 py-2 text-sm text-olive">
                  {dictionary.admin.lastActionLabel}:{" "}
                  {dictionary.admin.status[status as keyof typeof dictionary.admin.status] ??
                    status}
                </p>
              ) : null}
              {errorMessage ? (
                <p className="inline-flex rounded-full border border-red-600/20 bg-red-50 px-4 py-2 text-sm text-red-800">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            {!isDatabaseMode ? (
              <p className="mt-5 rounded-[22px] border border-amber-600/20 bg-amber-50/90 px-4 py-3 text-sm leading-7 text-amber-900">
                {dictionary.admin.disabledMessage}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4">
            <article className="rounded-[26px] border border-white/55 bg-white/78 p-5 shadow-[0_16px_34px_rgba(107,79,58,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                {dictionary.admin.dashboard.stats.products}
              </p>
              <p className="mt-4 font-serif text-4xl text-dark">
                {allProducts.length.toString().padStart(2, "0")}
              </p>
            </article>
            <article className="rounded-[26px] border border-brown/10 bg-[linear-gradient(135deg,rgba(223,229,212,0.72),rgba(255,255,255,0.94))] p-5 shadow-[0_16px_34px_rgba(107,79,58,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                {dictionary.admin.dataSourceLabel}
              </p>
              <p className="mt-4 font-serif text-4xl text-dark">
                {env.PRODUCTS_DATA_SOURCE.toUpperCase()}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/55 bg-white/86 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              {dictionary.admin.inventory.catalogBadge}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              {products.length}{" "}
              {products.length === 1
                ? dictionary.admin.inventory.visibleProducts
                : dictionary.admin.inventory.visibleProductsPlural}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-[30px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.76),rgba(239,228,215,0.78))] p-6 shadow-[0_16px_30px_rgba(107,79,58,0.05)]"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[24px] border border-white/50 bg-white/70 shadow-[0_10px_24px_rgba(107,79,58,0.08)]">
                    <span
                      className="h-8 w-8 rounded-full border border-white/60"
                      style={{ backgroundColor: product.color }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-3xl text-dark">{product.name}</h3>
                      <span className="rounded-full bg-white/74 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown/70">
                        {product.tag}
                      </span>
                      {product.featured ? (
                        <span className="rounded-full bg-olive/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-olive">
                          {dictionary.admin.dashboard.stats.featured}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-text/75">
                      #{product.id} | {dictionary.admin.inventory.pathLabel}: /products/
                      {product.slug}
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-text/70">
                      {product.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/72">
                        TL {priceFormatter.format(product.price)}
                      </span>
                      {product.weight ? (
                        <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown/60">
                          {product.weight}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/admin/products/${product.id}`}
                    className="rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5"
                  >
                    {dictionary.admin.inventory.edit}
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      disabled={!isDatabaseMode}
                      className="rounded-full border border-red-600/30 bg-white/65 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-muted disabled:text-muted"
                    >
                      {dictionary.admin.inventory.delete}
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
