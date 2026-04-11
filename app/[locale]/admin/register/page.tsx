import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminAuthScreen from "@/components/admin/AdminAuthScreen";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import {
  getAdminRegistrationState,
  getAdminSession,
  getAdminSessionRecoveryPath,
} from "@/services/admin-auth";
import { registerAdminAction } from "../actions";

export default async function AdminRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, registrationState, session] = await Promise.all([
    getDictionary(locale),
    getAdminRegistrationState(),
    getAdminSession(),
  ]);
  const { error, status } = await searchParams;

  if (!registrationState.isFirstAdminSetup && !session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/register`,
      }),
    );
  }

  const alerts: Array<{
    tone: "error" | "success" | "info";
    text: string;
  }> = [];

  if (error === "invalid") {
    alerts.push({ tone: "error", text: dictionary.admin.register.invalidForm });
  } else if (error === "username") {
    alerts.push({ tone: "error", text: dictionary.admin.register.usernameTaken });
  } else if (error === "email") {
    alerts.push({ tone: "error", text: dictionary.admin.register.emailTaken });
  } else if (error === "closed") {
    alerts.push({ tone: "error", text: dictionary.admin.register.registrationClosed });
  } else if (error === "setup-token-required") {
    alerts.push({ tone: "error", text: dictionary.admin.register.setupTokenRequired });
  } else if (error === "setup-token-invalid") {
    alerts.push({ tone: "error", text: dictionary.admin.register.setupTokenInvalid });
  } else if (error === "rate-limit") {
    alerts.push({ tone: "error", text: dictionary.admin.register.rateLimited });
  } else if (error === "forbidden") {
    alerts.push({ tone: "error", text: dictionary.admin.register.insufficientPermissions });
  }

  if (status === "created") {
    alerts.push({ tone: "success", text: dictionary.admin.register.created });
  }

  alerts.push({
    tone: "info",
    text: registrationState.isFirstAdminSetup
      ? dictionary.admin.register.firstAdminHint
      : dictionary.admin.register.teamHint,
  });

  if (registrationState.isFirstAdminSetup && registrationState.setupTokenRequired) {
    alerts.push({ tone: "info", text: dictionary.admin.register.setupTokenHint });
  }

  return (
    <AdminAuthScreen
      badge={dictionary.admin.badge}
      heroKicker={dictionary.admin.register.kicker}
      heroTitle={dictionary.admin.register.title}
      heroDescription={dictionary.admin.register.description}
      heroCards={[
        {
          eyebrow: dictionary.admin.badge,
          value: registrationState.isFirstAdminSetup
            ? dictionary.admin.register.submit
            : dictionary.admin.dashboard.manageAccess,
        },
        {
          eyebrow: registrationState.isFirstAdminSetup
            ? `/${locale.toUpperCase()}`
            : session?.user.displayName ?? session?.user.username ?? `/${locale.toUpperCase()}`,
          value: registrationState.isFirstAdminSetup
            ? dictionary.admin.login.title
            : dictionary.admin.register.title,
        },
      ]}
      formKicker={dictionary.admin.register.submit}
      formTitle={dictionary.admin.badge}
      alerts={alerts}
      footer={
        <div className="flex flex-wrap gap-3">
          <Link
            href={
              registrationState.isFirstAdminSetup
                ? `/${locale}/admin/login`
                : `/${locale}/admin`
            }
            className="inline-flex rounded-full border border-brown/12 bg-white/75 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            {registrationState.isFirstAdminSetup
              ? dictionary.admin.register.signInLinkLabel
              : dictionary.admin.register.dashboardLinkLabel}
          </Link>
        </div>
      }
    >
      <form action={registerAdminAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.register.displayName}
          </span>
          <input
            name="displayName"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.register.email}
          </span>
          <input
            type="email"
            name="email"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.register.username}
          </span>
          <input
            name="username"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.register.password}
          </span>
          <input
            type="password"
            name="password"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-dark">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.register.confirmPassword}
          </span>
          <input
            type="password"
            name="confirmPassword"
            required
            className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
          />
        </label>
        {registrationState.isFirstAdminSetup && registrationState.setupTokenRequired ? (
          <label className="flex flex-col gap-2 text-sm text-dark">
            <span className="uppercase tracking-[0.16em] text-muted">
              {dictionary.admin.register.setupToken}
            </span>
            <input
              type="password"
              name="setupToken"
              required
              className="rounded-[18px] border border-brown/15 bg-white/78 px-4 py-4 outline-none transition-colors focus:border-brown"
            />
          </label>
        ) : null}
        <button
          type="submit"
          className="mt-4 rounded-full bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-6 py-3 text-sm uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(107,79,58,0.18)] transition-transform hover:-translate-y-0.5"
        >
          {dictionary.admin.register.submit}
        </button>
      </form>
    </AdminAuthScreen>
  );
}
