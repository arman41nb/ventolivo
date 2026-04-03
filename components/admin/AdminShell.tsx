import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { logoutAdminAction } from "@/app/[locale]/admin/actions";

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

export default function AdminShell({
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
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f2e9_0%,#efe3d1_100%)] px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[28px] border border-brown/15 bg-white/80 p-8 backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                {dictionary.admin.badge}
              </p>
              <h1 className="mt-3 font-serif text-5xl leading-none text-dark">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-text/80">{description}</p>
              {sessionSummary ? (
                <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-full bg-cream/70 px-4 py-2 text-xs uppercase tracking-[0.14em] text-brown">
                  <span>{sessionSummary.username}</span>
                  <span className="text-brown/40">/</span>
                  <span>{sessionSummary.expiresLabel}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {secondaryAction ? (
                <Link
                  href={secondaryAction.href}
                  className="rounded-full border border-brown/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
              <form action={logoutAdminAction}>
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="rounded-full border border-brown/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                >
                  {dictionary.admin.dashboard.logout}
                </button>
              </form>
            </div>
          </div>
        </section>

        {navItems && navItems.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                  item.active
                    ? "bg-brown text-white"
                    : "border border-brown/20 bg-white text-brown hover:bg-brown/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </main>
  );
}
