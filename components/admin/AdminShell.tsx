import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { logoutAdminAction } from "@/app/[locale]/admin/actions";
import { getSiteLocales } from "@/modules/site-content";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";

interface AdminShellProps {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  description: string;
  children: ReactNode;
  sessionSummary?: {
    username: string;
    expiresLabel: string;
  };
  navItems?: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
}

export default async function AdminShell({
  locale,
  dictionary,
  title,
  description,
  children,
  sessionSummary,
  navItems,
  primaryAction,
  secondaryAction,
}: AdminShellProps) {
  const supportedLocales = await getSiteLocales();
  const activeItem = navItems?.find((item) => item.active);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_24%),linear-gradient(180deg,#f6f0e8_0%,#f0e7dc_48%,#eadfce_100%)] p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1540px] flex-wrap items-center justify-between gap-3 rounded-full border border-white/50 bg-white/55 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-brown/78 shadow-[0_16px_36px_rgba(107,79,58,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-olive" />
            {dictionary.admin.badge}
          </span>
          {activeItem ? (
            <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-1 text-brown/80">
              {activeItem.label}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-brown/60">
          <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-1">
            /{locale.toUpperCase()}
          </span>
          <span className="rounded-full border border-brown/10 bg-white/70 px-3 py-1">
            {supportedLocales.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-4 grid min-h-[calc(100vh-6rem)] w-full max-w-[1540px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="relative flex h-full flex-col overflow-hidden rounded-[38px] border border-white/8 bg-[linear-gradient(180deg,#352419_0%,#2c1f14_48%,#23180f_100%)] p-5 text-white shadow-[0_30px_80px_rgba(44,31,20,0.24)] lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_68%)]" />
          <div className="pointer-events-none absolute -right-16 top-40 h-40 w-40 rounded-full bg-olive/15 blur-3xl" />

          <div className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-[linear-gradient(135deg,#8ea16e_0%,#7c8c5e_55%,#6b4f3a_100%)] text-xl font-semibold text-white shadow-[0_18px_38px_rgba(124,140,94,0.34)]">
                V
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-3xl leading-none">Ventolivo</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/52">
                  {dictionary.admin.badge}
                </p>
              </div>
            </div>

            {sessionSummary ? (
              <div className="mt-5 rounded-[22px] border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/48">
                  {activeItem?.label ?? title}
                </p>
                <p className="mt-3 text-sm font-medium text-white/90">
                  {sessionSummary.username}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/58">
                  {sessionSummary.expiresLabel}
                </p>
              </div>
            ) : null}
          </div>

          {navItems && navItems.length > 0 ? (
            <div className="relative mt-6">
              <nav className="grid gap-2.5">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between gap-3 rounded-[20px] border px-4 py-3.5 transition-all ${
                      item.active
                        ? "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(124,140,94,0.24))] text-white shadow-[0_18px_34px_rgba(124,140,94,0.14)]"
                        : "border-white/7 bg-white/[0.04] text-white/74 hover:border-white/12 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-[16px] border text-[11px] tracking-[0.18em] transition-colors ${
                          item.active
                            ? "border-white/10 bg-white/12 text-white/88"
                            : "border-white/8 bg-black/10 text-white/55 group-hover:bg-white/10 group-hover:text-white/72"
                        }`}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-medium">{item.label}</span>
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        item.active ? "bg-olive" : "bg-white/18 group-hover:bg-white/40"
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}

          <div className="relative mt-auto rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/48">
              {dictionary.admin.dataSourceLabel}
            </p>
            <p className="mt-3 font-serif text-3xl text-white/94">
              {activeItem?.label ?? title}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {description}
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <section className="relative overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,252,247,0.86),rgba(242,234,224,0.92)_52%,rgba(233,223,211,0.94)_100%)] p-6 shadow-[0_30px_70px_rgba(107,79,58,0.14)] md:p-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top,rgba(124,140,94,0.24),transparent_64%)] lg:block" />
            <div className="pointer-events-none absolute -top-14 left-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-12 h-36 w-36 rounded-full bg-brown/10 blur-3xl" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/72 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  {dictionary.admin.badge}
                </div>
                <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.94] text-dark md:text-6xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-text/80 md:text-[15px]">
                  {description}
                </p>

                {navItems && navItems.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
                          item.active
                            ? "border-transparent bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] text-white shadow-[0_16px_28px_rgba(107,79,58,0.18)]"
                            : "border-brown/12 bg-white/70 text-brown/76 hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4">
                {sessionSummary ? (
                  <div className="rounded-[28px] border border-white/55 bg-white/72 p-5 shadow-[0_18px_40px_rgba(107,79,58,0.08)] backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                      {dictionary.admin.dashboard.sessionExpires}
                    </p>
                    <p className="mt-3 font-serif text-3xl text-dark">
                      {sessionSummary.username}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-text/72">
                      {sessionSummary.expiresLabel}
                    </p>
                  </div>
                ) : null}

                <div className="rounded-[28px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,243,237,0.92))] p-5 shadow-[0_18px_40px_rgba(107,79,58,0.08)]">
                  <div className="grid gap-3">
                    <AdminLocaleSwitcher
                      currentLocale={locale}
                      locales={supportedLocales}
                      label={dictionary.admin.shell.localeSwitcher}
                    />
                    {secondaryAction ? (
                      <Link
                        href={secondaryAction.href}
                        className="rounded-[18px] border border-brown/12 bg-white/76 px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
                      >
                        {secondaryAction.label}
                      </Link>
                    ) : null}
                    {primaryAction ? (
                      <Link
                        href={primaryAction.href}
                        className="rounded-[18px] bg-[linear-gradient(135deg,#7c8c5e_0%,#6b4f3a_100%)] px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(107,79,58,0.2)] transition-transform hover:-translate-y-0.5"
                      >
                        {primaryAction.label}
                      </Link>
                    ) : null}
                    <form action={logoutAdminAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="w-full rounded-[18px] border border-brown/12 bg-transparent px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                      >
                        {dictionary.admin.dashboard.logout}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5">{children}</div>
        </div>
      </div>
    </main>
  );
}
