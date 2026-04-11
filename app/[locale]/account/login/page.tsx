import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import StorefrontThemeScope from "@/components/theme/StorefrontThemeScope";
import { isValidLocale, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { env } from "@/lib/env";
import { getCustomerSession, getSafeCustomerNextPath } from "@/services/customer-auth";
import { getStorefrontData } from "@/services/storefront";
import { loginCustomerAction, registerCustomerAction } from "../actions";

type AccountMode = "signin" | "register";

export default async function CustomerLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string; error?: string; status?: string; next?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [{ content, siteSettings, supportedLocales, dictionary }, session, search] =
    await Promise.all([getStorefrontData(locale), getCustomerSession(), searchParams]);
  const mode: AccountMode = search.mode === "register" ? "register" : "signin";
  const googleAvailable = Boolean(env.GOOGLE_CLIENT_ID?.trim() && env.GOOGLE_CLIENT_SECRET?.trim());
  const googleAuthHref = `/api/account/oauth/google/start?locale=${encodeURIComponent(locale)}${
    search.next ? `&next=${encodeURIComponent(search.next)}` : ""
  }`;

  if (session) {
    redirect(getSafeCustomerNextPath(search.next, locale));
  }

  const alerts: Array<{
    tone: "error" | "success" | "info";
    text: string;
  }> = [];

  if (search.error === "credentials" || (search.error === "invalid" && mode === "signin")) {
    alerts.push({ tone: "error", text: dictionary.account.login.invalidCredentials });
  } else if (search.error === "rate-limit") {
    alerts.push({
      tone: "error",
      text: mode === "signin" ? dictionary.account.login.rateLimited : dictionary.account.register.rateLimited,
    });
  } else if (search.error === "disabled") {
    alerts.push({ tone: "error", text: dictionary.account.login.accountDisabled });
  } else if (search.error === "email") {
    alerts.push({ tone: "error", text: dictionary.account.register.emailTaken });
  } else if (search.error === "invalid" && mode === "register") {
    alerts.push({ tone: "error", text: dictionary.account.register.invalidForm });
  } else if (search.error === "google-unavailable") {
    alerts.push({ tone: "error", text: dictionary.account.login.googleUnavailable });
  } else if (search.error === "google-denied") {
    alerts.push({ tone: "error", text: dictionary.account.login.googleDenied });
  } else if (search.error === "google-failed") {
    alerts.push({ tone: "error", text: dictionary.account.login.googleFailed });
  }

  if (search.status === "logged-out") {
    alerts.push({ tone: "success", text: dictionary.account.login.loggedOut });
  }

  if (mode === "register") {
    alerts.push({ tone: "info", text: dictionary.account.register.passwordHint });
  }

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
      />
      <main className="px-4 py-10 md:px-6 md:py-14">
        <section className="mx-auto max-w-[980px] rounded-[34px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.86),rgba(239,228,215,0.92)_58%,rgba(255,255,255,0.9)_100%)] p-7 shadow-[0_24px_56px_rgba(71,49,30,0.1)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article>
              <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
                <span className="h-2 w-2 rounded-full bg-olive" />
                {dictionary.account.badge}
              </p>
              <h1 className="mt-5 font-serif text-[2.8rem] leading-[0.94] text-dark md:text-[4rem]">
                {mode === "signin" ? dictionary.account.login.title : dictionary.account.register.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-text/74">
                {mode === "signin"
                  ? dictionary.account.login.description
                  : dictionary.account.register.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={localePath(
                    locale,
                    `/account/login?mode=signin${
                      search.next ? `&next=${encodeURIComponent(search.next)}` : ""
                    }`,
                  )}
                  className={`rounded-full border px-5 py-3 text-xs uppercase tracking-[0.16em] transition-all ${
                    mode === "signin"
                      ? "border-transparent bg-brown text-white"
                      : "border-brown/12 bg-white text-brown hover:-translate-y-0.5 hover:bg-brown hover:text-white"
                  }`}
                >
                  {dictionary.account.nav.signIn}
                </Link>
                <Link
                  href={localePath(
                    locale,
                    `/account/login?mode=register${
                      search.next ? `&next=${encodeURIComponent(search.next)}` : ""
                    }`,
                  )}
                  className={`rounded-full border px-5 py-3 text-xs uppercase tracking-[0.16em] transition-all ${
                    mode === "register"
                      ? "border-transparent bg-brown text-white"
                      : "border-brown/12 bg-white text-brown hover:-translate-y-0.5 hover:bg-brown hover:text-white"
                  }`}
                >
                  {dictionary.account.nav.register}
                </Link>
              </div>
            </article>

            <article className="rounded-[26px] border border-brown/10 bg-white/78 p-6 shadow-[0_16px_34px_rgba(71,49,30,0.08)]">
              <h2 className="font-serif text-3xl text-dark">
                {mode === "signin" ? dictionary.account.login.submit : dictionary.account.register.submit}
              </h2>
              {alerts.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {alerts.map((alert, index) => (
                    <p
                      key={`${alert.tone}-${index}`}
                      className={`rounded-[18px] border px-4 py-3 text-sm ${
                        alert.tone === "error"
                          ? "border-red-500/20 bg-red-50 text-red-700"
                          : alert.tone === "success"
                            ? "border-olive/20 bg-olive/10 text-olive"
                            : "border-brown/12 bg-white/74 text-text/74"
                      }`}
                    >
                      {alert.text}
                    </p>
                  ))}
                </div>
              ) : null}

              {googleAvailable ? (
                <a
                  href={googleAuthHref}
                  className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-brown/12 bg-white px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-brown hover:text-white no-underline"
                >
                  {dictionary.account.login.continueWithGoogle}
                </a>
              ) : (
                <p className="mt-6 rounded-[16px] border border-brown/10 bg-white/72 px-4 py-3 text-sm text-text/72">
                  {dictionary.account.login.googleUnavailable}
                </p>
              )}

              {mode === "signin" ? (
                <form action={loginCustomerAction} className="mt-5 grid gap-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="next" value={search.next ?? ""} />
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.login.email}
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.login.password}
                    </span>
                    <input
                      type="password"
                      name="password"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-2 rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-6 py-3 text-xs uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(107,79,58,0.18)] transition-transform hover:-translate-y-0.5"
                  >
                    {dictionary.account.login.submit}
                  </button>
                </form>
              ) : (
                <form action={registerCustomerAction} className="mt-5 grid gap-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="next" value={search.next ?? ""} />
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.register.fullName}
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.register.email}
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.register.phone}
                    </span>
                    <input
                      type="text"
                      name="phone"
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.register.password}
                    </span>
                    <input
                      type="password"
                      name="password"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-dark">
                    <span className="uppercase tracking-[0.16em] text-muted">
                      {dictionary.account.register.confirmPassword}
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="rounded-[16px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
                    />
                  </label>
                  <label className="flex items-start gap-3 rounded-[16px] border border-brown/10 bg-white/72 px-4 py-3 text-sm text-text/76">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      className="mt-1 h-4 w-4 rounded border-brown/30 text-brown focus:ring-brown"
                    />
                    <span>{dictionary.account.register.marketingConsent}</span>
                  </label>
                  <button
                    type="submit"
                    className="mt-2 rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-6 py-3 text-xs uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(107,79,58,0.18)] transition-transform hover:-translate-y-0.5"
                  >
                    {dictionary.account.register.submit}
                  </button>
                </form>
              )}
            </article>
          </div>
        </section>
      </main>
      <Footer brandName={content.brandName} content={content.footer} locale={locale} />
    </StorefrontThemeScope>
  );
}
