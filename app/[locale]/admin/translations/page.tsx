import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SiteContentTranslationAssistant from "@/components/admin/SiteContentTranslationAssistant";
import SiteLocalesManager from "@/components/admin/SiteLocalesManager";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getSiteContentSettings, getSiteLocales } from "@/services/site-content";
import type { SiteContentSettings } from "@/types";
import { saveSiteContentAction } from "../site/actions";

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-olive px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
    >
      {label}
    </button>
  );
}

function HiddenSettingsFields({ settings }: { settings: SiteContentSettings }) {
  return (
    <>
      {(
        Object.entries(settings) as Array<
          [keyof SiteContentSettings, SiteContentSettings[keyof SiteContentSettings]]
        >
      ).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value ?? ""} />
      ))}
    </>
  );
}

export default async function AdminTranslationsPage({
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
        next: `/${locale}/admin/translations`,
      }),
    );
  }

  const [settings, supportedLocales] = await Promise.all([
    getSiteContentSettings(locale),
    getSiteLocales(),
  ]);

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.navigation.translations}
      description={`${dictionary.admin.siteTranslationAssistant.description} ${dictionary.admin.siteLocalesManager.description}`}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      primaryAction={{
        href: `/${locale}/admin/site`,
        label: dictionary.admin.navigation.siteContent,
      }}
      navItems={getAdminNavItems(locale, "translations", dictionary.admin.navigation)}
    >
      {status === "updated" ? (
        <p className="rounded-2xl border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
          {dictionary.admin.siteStudio.updated}
        </p>
      ) : null}

      <form action={saveSiteContentAction} className="grid gap-6">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="redirectTo" value={`/${locale}/admin/translations`} />
        <HiddenSettingsFields settings={settings} />

        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                {dictionary.admin.siteTranslationAssistant.badge}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">
                {dictionary.admin.siteTranslationAssistant.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm text-text/75">
                {dictionary.admin.siteTranslationAssistant.description}
              </p>
            </div>
            <SubmitButton label={dictionary.admin.inventory.save} />
          </div>

          <div className="mt-6">
            <SiteContentTranslationAssistant
              currentLocale={locale}
              locales={supportedLocales}
              dictionary={dictionary.admin.siteTranslationAssistant}
            />
          </div>
        </section>

        <SiteLocalesManager
          currentLocale={locale}
          locales={supportedLocales}
          dictionary={dictionary.admin.siteLocalesManager}
        />
      </form>
    </AdminShell>
  );
}
