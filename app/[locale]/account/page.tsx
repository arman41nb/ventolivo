import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { isValidLocale, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import {
  getCustomerBuyerIntents,
  getCustomerSession,
  getCustomerSessionRecoveryPath,
} from "@/services/customer-auth";
import { getStorefrontData } from "@/services/storefront";
import { logoutCustomerAction } from "./actions";

function getUserInitials(fullName: string) {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "U";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, session] = await Promise.all([
    getStorefrontData(locale),
    getCustomerSession(),
  ]);

  if (!session) {
    redirect(
      getCustomerSessionRecoveryPath({
        locale,
        next: `/${locale}/account`,
      }),
    );
  }

  const intents = await getCustomerBuyerIntents(session.user.id, 12);

  return (
    <StorefrontThemeScope settings={siteSettings} className="page-shell min-h-screen">
      <Navbar
        locale={locale}
        brand={{
          name: content.brandName,
          logoMode: siteSettings.logoMode,
          logoText: siteSettings.logoText,
          logoImageUrl: siteSettings.logoImageUrl,
          logoAltText: siteSettings.logoAltText,
        }}
        content={content.navbar}
        supportedLocales={supportedLocales}
        accountLabels={dictionary.account.nav}
        customerSession={{
          fullName: session.user.fullName,
          avatarUrl: session.user.avatarUrl,
        }}
      />
      <main className="px-4 py-10 md:px-6 md:py-14">
        <section className="mx-auto max-w-[1180px] grid gap-6">
          <article className="relative overflow-hidden rounded-[34px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.88),rgba(239,228,215,0.94)_54%,rgba(223,229,212,0.72)_100%)] p-7 shadow-[0_22px_52px_rgba(71,49,30,0.1)] md:p-9">
            <span className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/35 blur-3xl" />
            <span className="pointer-events-none absolute -left-8 bottom-2 h-32 w-32 rounded-full bg-olive/18 blur-2xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/72 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  {dictionary.account.badge}
                </p>
                <span className="rounded-full border border-brown/10 bg-white/72 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-brown/72">
                  Active member
                </span>
              </div>

              <div className="mt-5 grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
                {session.user.avatarUrl ? (
                  <img
                    src={session.user.avatarUrl}
                    alt={session.user.fullName}
                    className="h-24 w-24 rounded-[28px] border border-white/70 object-cover shadow-[0_16px_30px_rgba(71,49,30,0.12)]"
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] text-3xl font-semibold text-white shadow-[0_16px_30px_rgba(71,49,30,0.16)]">
                    {getUserInitials(session.user.fullName)}
                  </div>
                )}
                <div>
                  <h1 className="font-serif text-[2.7rem] leading-[0.92] text-dark md:text-[3.8rem]">
                    {dictionary.account.dashboard.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-text/74">
                    {dictionary.account.dashboard.description}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/55 bg-white/76 p-5 shadow-[0_14px_28px_rgba(71,49,30,0.08)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    {dictionary.account.dashboard.fullName}
                  </p>
                  <p className="mt-3 text-lg font-medium text-dark">{session.user.fullName}</p>
                </div>
                <div className="rounded-[24px] border border-white/55 bg-white/76 p-5 shadow-[0_14px_28px_rgba(71,49,30,0.08)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    {dictionary.account.dashboard.email}
                  </p>
                  <p className="mt-3 text-lg font-medium text-dark break-words">{session.user.email}</p>
                </div>
                <div className="rounded-[24px] border border-white/55 bg-white/76 p-5 shadow-[0_14px_28px_rgba(71,49,30,0.08)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    {dictionary.account.dashboard.intentCount}
                  </p>
                  <p className="mt-3 font-serif text-4xl leading-none text-dark">
                    {intents.length.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={localePath(locale, "/products")}
                  className="rounded-full border border-brown/12 bg-white/78 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  {dictionary.account.dashboard.browseProducts}
                </Link>
                <form action={logoutCustomerAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                  >
                    {dictionary.account.nav.signOut}
                  </button>
                </form>
              </div>
            </div>
          </article>

          <article className="rounded-[32px] border border-white/55 bg-white/84 p-6 shadow-[0_24px_50px_rgba(71,49,30,0.08)] md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {dictionary.account.dashboard.intentHistoryBadge}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-dark">
                  {dictionary.account.dashboard.intentHistoryTitle}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {intents.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-brown/20 bg-[linear-gradient(180deg,rgba(255,252,247,0.72),rgba(239,228,215,0.52))] p-6 text-sm text-text/72">
                  {dictionary.account.dashboard.noIntents}
                </div>
              ) : (
                intents.map((intent) => (
                  <article
                    key={intent.id}
                    className="rounded-[24px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.78),rgba(239,228,215,0.82))] p-5 shadow-[0_12px_24px_rgba(71,49,30,0.06)]"
                  >
                    <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                      <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] text-white shadow-[0_10px_20px_rgba(71,49,30,0.14)]">
                        <span className="text-lg">#</span>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-dark">
                          {intent.product?.name ?? dictionary.account.dashboard.unknownProduct}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-brown/70">
                          <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">
                            {intent.channel}
                          </span>
                          <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">
                            {intent.locale.toUpperCase()}
                          </span>
                          {intent.source ? (
                            <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">
                              {intent.source}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-brown/70">
                        {intent.createdAt.toLocaleString(locale)}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={locale} />
    </StorefrontThemeScope>
  );
}
