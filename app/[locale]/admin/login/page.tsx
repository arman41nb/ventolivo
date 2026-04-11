import Link from "next/link";
import { notFound } from "next/navigation";
import AdminAuthScreen from "@/components/admin/AdminAuthScreen";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminRegistrationState } from "@/services/admin-auth";
import { loginAdminAction } from "../actions";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; status?: string; next?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, registrationState] = await Promise.all([
    getDictionary(locale),
    getAdminRegistrationState(),
  ]);
  const { error, status, next } = await searchParams;
  const alerts: Array<{
    tone: "error" | "success" | "info";
    text: string;
  }> = [];

  if (error === "credentials" || error === "invalid") {
    alerts.push({ tone: "error", text: dictionary.admin.login.invalidCredentials });
  } else if (error === "rate-limit") {
    alerts.push({ tone: "error", text: dictionary.admin.login.rateLimited });
  } else if (error === "disabled") {
    alerts.push({ tone: "error", text: dictionary.admin.login.accountDisabled });
  }

  if (status === "logged-out") {
    alerts.push({ tone: "success", text: dictionary.admin.login.loggedOut });
  }

  if (registrationState.isFirstAdminSetup) {
    alerts.push({ tone: "info", text: dictionary.admin.login.setupNotice });
  }

  return (
    <AdminAuthScreen
      badge={dictionary.admin.badge}
      heroKicker={dictionary.admin.login.kicker}
      heroTitle={dictionary.admin.login.title}
      heroDescription={dictionary.admin.login.description}
      heroCards={[
        {
          eyebrow: dictionary.admin.badge,
          value: dictionary.admin.login.submit,
        },
        {
          eyebrow: registrationState.isFirstAdminSetup
            ? dictionary.admin.dashboard.manageAccess
            : `/${locale.toUpperCase()}`,
          value: registrationState.isFirstAdminSetup
            ? dictionary.admin.register.title
            : dictionary.admin.login.title,
        },
      ]}
      formKicker={dictionary.admin.login.submit}
      formTitle={dictionary.admin.badge}
      alerts={alerts}
      footer={
        registrationState.isFirstAdminSetup ? (
          <div className="space-y-4">
            <p className="rounded-[22px] border border-brown/10 bg-white/62 px-4 py-4 text-sm leading-7 text-text/72">
              {dictionary.admin.login.bootstrapHint}
            </p>
            <Link
              href={`/${locale}/admin/register`}
              className="inline-flex rounded-full border border-brown/12 bg-white/75 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              {dictionary.admin.login.registerLinkLabel}
            </Link>
          </div>
        ) : null
      }
    >
      <form action={loginAdminAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={next ?? ""} />
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.login.identifier}
          </span>
          <input
            name="identifier"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.login.password}
          </span>
          <input
            type="password"
            name="password"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <button
          type="submit"
          className="mt-4 rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-6 py-3 text-sm uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(107,79,58,0.18)] transition-transform hover:-translate-y-0.5"
        >
          {dictionary.admin.login.submit}
        </button>
      </form>
    </AdminAuthScreen>
  );
}
