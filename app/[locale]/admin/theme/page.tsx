import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SiteContentForm from "@/components/admin/SiteContentForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getAllMediaAssets } from "@/services/media";
import {
  getSiteContentSettings,
  getSiteLocales,
  getSiteThemePresets,
} from "@/services/site-content";
import { getFeaturedProducts } from "@/services/products";
import { saveSiteContentAction } from "../site/actions";

export default async function AdminThemeStudioPage({
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
        next: `/${locale}/admin/theme`,
      }),
    );
  }

  const [settings, mediaLibrary, featuredProducts, supportedLocales, themePresets] =
    await Promise.all([
      getSiteContentSettings(locale),
      getAllMediaAssets(),
      getFeaturedProducts(4, locale),
      getSiteLocales(),
      getSiteThemePresets(),
    ]);

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.themeStudio.title}
      description={dictionary.admin.themeStudio.description}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      primaryAction={{
        href: `/${locale}/admin/site`,
        label: dictionary.admin.navigation.siteContent,
      }}
      navItems={getAdminNavItems(locale, "theme", dictionary.admin.navigation)}
      immersivePreview
    >
      {status === "updated" ? (
        <p className="rounded-2xl border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
          {dictionary.admin.themeStudio.updated}
        </p>
      ) : null}
      <SiteContentForm
        locale={locale}
        action={saveSiteContentAction}
        settings={settings}
        themePresets={themePresets}
        dictionary={dictionary}
        mediaLibrary={mediaLibrary}
        featuredProducts={featuredProducts}
        supportedLocales={supportedLocales}
        initialWorkspacePanel="theme"
        redirectTo={`/${locale}/admin/theme`}
        studioMode="theme"
      />
    </AdminShell>
  );
}
