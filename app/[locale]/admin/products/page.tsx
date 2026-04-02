import { notFound } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { getAllProducts } from "@/services/products";
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
  const dictionary = await getDictionary(locale);
  const { error, status, q } = await searchParams;
  const allProducts = await getAllProducts(locale);
  const isDatabaseMode = env.PRODUCTS_DATA_SOURCE === "database";
  const searchTerm = (q ?? "").trim().toLocaleLowerCase();
  const errorMessage =
    error === "slug-conflict" ? dictionary.admin.errors.slugConflict : null;
  const products = searchTerm
    ? allProducts.filter((product) =>
        [product.name, product.slug, product.tag]
          .join(" ")
          .toLocaleLowerCase()
          .includes(searchTerm),
      )
    : allProducts;

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.inventory.title}
      description={dictionary.admin.inventory.managerDescription}
      primaryAction={{
        href: `/${locale}/admin/products/new`,
        label: dictionary.admin.create.submit,
      }}
      secondaryAction={{
        href: `/${locale}/admin`,
        label: dictionary.admin.inventory.backToDashboard,
      }}
    >
      <section className="rounded-[28px] border border-brown/15 bg-white/80 p-8 backdrop-blur">
          {status ? (
            <p className="mt-4 inline-flex rounded-full bg-olive/10 px-4 py-2 text-sm text-olive">
              {dictionary.admin.lastActionLabel}:{" "}
              {dictionary.admin.status[
                status as keyof typeof dictionary.admin.status
              ] ?? status}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="mt-4 rounded-2xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </p>
          ) : null}
          {!isDatabaseMode ? (
            <p className="mt-4 rounded-2xl border border-amber-600/20 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {dictionary.admin.disabledMessage}
            </p>
          ) : null}
          <form className="mt-6">
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder={dictionary.admin.inventory.searchPlaceholder}
              className="w-full border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </form>
      </section>

      <section className="rounded-[28px] border border-brown/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
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
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-[24px] border border-brown/10 bg-cream/40 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-serif text-3xl text-dark">{product.name}</h3>
                  <p className="mt-1 text-sm text-text/75">
                    #{product.id} | {dictionary.admin.inventory.pathLabel}: /products/{product.slug}
                  </p>
                  <p className="mt-2 text-sm text-text/70">{product.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/admin/products/${product.id}`}
                    className="rounded-full bg-olive px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                  >
                    {dictionary.admin.inventory.save}
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      disabled={!isDatabaseMode}
                      className="rounded-full border border-red-600/30 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-muted disabled:text-muted"
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
