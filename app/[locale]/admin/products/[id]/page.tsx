import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductEditorForm from "@/components/admin/ProductEditorForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { getAdminSessionRecoveryPath } from "@/modules/admin-auth/navigation";
import { getAdminSession } from "@/modules/admin-auth/server";
import { getAllMediaAssets } from "@/modules/media";
import { getSiteLocales } from "@/modules/site-content";
import { getProductById } from "@/services/products";
import { updateProductAction } from "../actions";

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale: rawLocale, id: rawId } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const [dictionary, { error }, session] = await Promise.all([
    getDictionary(locale),
    searchParams,
    getAdminSession(),
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/products/${id}`,
      }),
    );
  }

  const [product, mediaLibrary, supportedLocales] = await Promise.all([
    getProductById(id),
    getAllMediaAssets(),
    getSiteLocales(),
  ]);

  if (!product) {
    notFound();
  }

  const isDatabaseMode = env.PRODUCTS_DATA_SOURCE === "database";
  const errorMessage =
    error === "slug-conflict" ? dictionary.admin.errors.slugConflict : null;

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={product.name}
      description={dictionary.admin.inventory.managerDescription}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={[
        { href: `/${locale}/admin`, label: "Dashboard" },
        { href: `/${locale}/admin/products`, label: "Products", active: true },
        { href: `/${locale}/admin/media`, label: "Library" },
        { href: `/${locale}/admin/site`, label: "Site content" },
      ]}
      secondaryAction={{
        href: `/${locale}/admin/products`,
        label: dictionary.admin.inventory.backToDashboard,
      }}
    >
      {errorMessage ? (
        <p className="rounded-2xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}
      {!isDatabaseMode ? (
        <p className="rounded-2xl border border-amber-600/20 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {dictionary.admin.disabledMessage}
        </p>
      ) : null}
      <ProductEditorForm
        locale={locale}
        dictionary={dictionary}
        submitLabel={dictionary.admin.inventory.save}
        action={updateProductAction}
        product={product}
        mediaLibrary={mediaLibrary}
        supportedLocales={supportedLocales}
        disabled={!isDatabaseMode}
      />
    </AdminShell>
  );
}
