import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import MediaLibraryForm from "@/components/admin/MediaLibraryForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSessionRecoveryPath } from "@/modules/admin-auth/navigation";
import { getAdminSession } from "@/modules/admin-auth/server";
import { getAdminNavItems } from "@/modules/admin/ui";
import { getAllMediaAssets } from "@/modules/media";
import {
  createMediaAssetAction,
  deleteMediaAssetAction,
  updateMediaAssetAction,
} from "./actions";

export default async function AdminMediaPage({
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
        next: `/${locale}/admin/media`,
      }),
    );
  }

  const assets = await getAllMediaAssets();

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.mediaLibrary.title}
      description={dictionary.admin.mediaLibrary.description}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={getAdminNavItems(locale, "media", dictionary.admin.navigation)}
    >
      {status ? (
        <p className="rounded-2xl border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
          {dictionary.admin.mediaLibrary.updated}
        </p>
      ) : null}
      <MediaLibraryForm
        locale={locale}
        dictionary={dictionary.admin.mediaManager}
        createAction={createMediaAssetAction}
        updateAction={updateMediaAssetAction}
        deleteAction={deleteMediaAssetAction}
        assets={assets}
      />
    </AdminShell>
  );
}
