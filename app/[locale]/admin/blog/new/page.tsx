import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import BlogEditorForm from "@/components/admin/BlogEditorForm";
import { siteConfig } from "@/config";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getAllMediaAssets } from "@/services/media";
import { createBlogPostAction } from "../actions";

export default async function AdminNewBlogPage({
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
  const [dictionary, session, mediaLibrary, { error }] = await Promise.all([
    getDictionary(locale),
    getAdminSession(),
    getAllMediaAssets(),
    searchParams,
  ]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/blog/new`,
      }),
    );
  }

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title="New Blog Post"
      description="Create a search-friendly article with clean metadata, structured slugs, and publish controls."
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={getAdminNavItems(locale, "blog", dictionary.admin.navigation)}
      secondaryAction={{
        href: `/${locale}/admin/blog`,
        label: "Back to blog manager",
      }}
    >
      {error === "slug-conflict" ? (
        <p className="rounded-2xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-800">
          This slug is already in use. Please choose a different slug.
        </p>
      ) : null}
      <BlogEditorForm
        locale={locale}
        siteUrl={siteConfig.url}
        submitLabel="Create post"
        action={createBlogPostAction}
        mediaLibrary={mediaLibrary}
      />
    </AdminShell>
  );
}
