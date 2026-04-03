import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SiteContentForm from "@/components/admin/SiteContentForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSessionRecoveryPath } from "@/modules/admin-auth/navigation";
import { getAdminSession } from "@/modules/admin-auth/server";
import { getAllMediaAssets } from "@/modules/media";
import { getSiteContentSettings, getSiteLocales } from "@/modules/site-content";
import { getFeaturedProducts } from "@/services/products";
import { saveSiteContentAction } from "./actions";

export default async function AdminSiteContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [{ status }, dictionary, session] = await Promise.all([
    searchParams,
    getDictionary(locale),
    getAdminSession(),
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/site`,
      }),
    );
  }

  const [settings, mediaLibrary, featuredProducts, supportedLocales] = await Promise.all([
    getSiteContentSettings(locale),
    getAllMediaAssets(),
    getFeaturedProducts(4, locale),
    getSiteLocales(),
  ]);

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title="Site content studio"
      description="Edit the homepage visually, preview changes live, and reuse library assets without leaving the content workflow."
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      primaryAction={{
        href: `/${locale}/admin/products`,
        label: dictionary.admin.dashboard.productManager,
      }}
      navItems={[
        { href: `/${locale}/admin`, label: "Dashboard" },
        { href: `/${locale}/admin/products`, label: "Products" },
        { href: `/${locale}/admin/media`, label: "Library" },
        { href: `/${locale}/admin/site`, label: "Site content", active: true },
      ]}
    >
      {status === "updated" ? (
        <p className="rounded-2xl border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
          Site content updated.
        </p>
      ) : null}
      <SiteContentForm
        locale={locale}
        action={saveSiteContentAction}
        settings={settings}
        dictionary={dictionary}
        mediaLibrary={mediaLibrary}
        featuredProducts={featuredProducts}
        supportedLocales={supportedLocales}
      />
    </AdminShell>
  );
}
