import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductEditorForm from "@/components/admin/ProductEditorForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { createProductAction } from "../actions";

export default async function AdminNewProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const { error } = await searchParams;
  const isDatabaseMode = env.PRODUCTS_DATA_SOURCE === "database";
  const errorMessage =
    error === "slug-conflict" ? dictionary.admin.errors.slugConflict : null;

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.create.title}
      description={dictionary.admin.inventory.managerDescription}
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
        submitLabel={dictionary.admin.create.submit}
        action={createProductAction}
        disabled={!isDatabaseMode}
      />
    </AdminShell>
  );
}
