import Link from "next/link";
import { notFound } from "next/navigation";
import ProductTranslationAssistant from "@/components/admin/ProductTranslationAssistant";
import { getDictionary } from "@/i18n";
import {
  isValidLocale,
  localeLabels,
  locales,
  type Locale,
} from "@/i18n/config";
import { env } from "@/lib/env";
import { getAllProducts } from "@/services/products";
import {
  createProductAction,
  deleteProductAction,
  logoutAdminAction,
  updateProductAction,
} from "../actions";

function ProductFormFields({
  locale,
  dictionary,
  product,
}: {
  locale: Locale;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  product?: Awaited<ReturnType<typeof getAllProducts>>[number];
}) {
  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.name}
          </span>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.slug}
          </span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.tag}
          </span>
          <input
            name="tag"
            defaultValue={product?.tag ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.price}
          </span>
          <input
            name="price"
            type="number"
            min="0"
            defaultValue={product?.price ?? 0}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.color}
          </span>
          <input
            name="color"
            defaultValue={product?.color ?? "#7C8C5E"}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.weight}
          </span>
          <input
            name="weight"
            defaultValue={product?.weight ?? ""}
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.ingredients}
        </span>
        <input
          name="ingredients"
          defaultValue={product?.ingredients?.join(", ") ?? ""}
          placeholder={dictionary.admin.form.ingredientsPlaceholder}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.description}
        </span>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          required
          rows={4}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>

      <div className="mt-6 rounded-[24px] border border-brown/10 bg-cream/30 p-5">
        <div className="flex flex-col gap-4">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            {dictionary.admin.inventory.translationsTitle}
          </p>
          <ProductTranslationAssistant
            currentLocale={locale}
            locales={locales}
            localeLabels={localeLabels}
            dictionary={dictionary.admin.translationAssistant}
          />
        </div>
        <div className="mt-4 grid gap-5">
          {locales.map((translationLocale) => (
            <div
              key={translationLocale}
              className="rounded-[20px] border border-brown/10 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brown">
                {localeLabels[translationLocale]}
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-muted">{dictionary.admin.form.name}</span>
                  <input
                    name={`translations.name.${translationLocale}`}
                    defaultValue={
                      product?.translations?.name?.[translationLocale] ?? ""
                    }
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-muted">{dictionary.admin.form.tag}</span>
                  <input
                    name={`translations.tag.${translationLocale}`}
                    defaultValue={
                      product?.translations?.tag?.[translationLocale] ?? ""
                    }
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </label>
              </div>
              <label className="mt-4 flex flex-col gap-2 text-sm">
                <span className="text-muted">
                  {dictionary.admin.form.description}
                </span>
                <textarea
                  name={`translations.description.${translationLocale}`}
                  defaultValue={
                    product?.translations?.description?.[translationLocale] ?? ""
                  }
                  rows={3}
                  className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <label className="mt-4 inline-flex items-center gap-3 text-sm text-dark">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured ?? false}
          className="h-4 w-4 accent-brown"
        />
        {dictionary.admin.form.featured}
      </label>
    </>
  );
}

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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f2e9_0%,#efe3d1_100%)] px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[28px] border border-brown/15 bg-white/80 p-8 backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                {dictionary.admin.inventory.badge}
              </p>
              <h1 className="mt-3 font-serif text-5xl leading-none text-dark">
                {dictionary.admin.inventory.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-text/80">
                {dictionary.admin.inventory.managerDescription}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/admin`}
                className="rounded-full border border-brown/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
              >
                {dictionary.admin.inventory.backToDashboard}
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
          <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
            {dictionary.admin.create.badge}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-dark">
            {dictionary.admin.create.title}
          </h2>
          <form action={createProductAction} className="mt-6">
            <ProductFormFields locale={locale} dictionary={dictionary} />
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isDatabaseMode}
                className="rounded-full bg-brown px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
              >
                {dictionary.admin.create.submit}
              </button>
            </div>
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
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-serif text-3xl text-dark">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-text/75">
                      #{product.id} | {dictionary.admin.inventory.pathLabel}: /products/{product.slug}
                    </p>
                  </div>
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
                <form action={updateProductAction}>
                  <ProductFormFields
                    locale={locale}
                    dictionary={dictionary}
                    product={product}
                  />
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={!isDatabaseMode}
                      className="rounded-full bg-olive px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
                    >
                      {dictionary.admin.inventory.save}
                    </button>
                  </div>
                </form>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
