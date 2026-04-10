"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { SiteLocaleConfig } from "@/types";

interface AdminShellFrameProps {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  description: string;
  children: ReactNode;
  supportedLocales: SiteLocaleConfig[];
  activeItemLabel?: string;
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
  immersivePreview?: boolean;
  logoutAction: (formData: FormData) => void | Promise<void>;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={1.7}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={1.7}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={1.7}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function SidebarContent({
  title,
  description,
  dictionary,
  navItems,
  activeItemLabel,
  sessionSummary,
  dismiss,
}: Pick<
  AdminShellFrameProps,
  "title" | "description" | "dictionary" | "navItems" | "sessionSummary" | "activeItemLabel"
> & {
  dismiss?: () => void;
}) {
  const accentStats = useMemo(
    () => [
      { label: "Active view", value: activeItemLabel ?? title },
      { label: "Tone", value: "Premium admin" },
    ],
    [activeItemLabel, title],
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_68%)]" />
      <div className="pointer-events-none absolute -left-10 top-44 h-32 w-32 rounded-full bg-[#ecd8c0]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-14 bottom-10 h-44 w-44 rounded-full bg-olive/18 blur-3xl" />

      <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04)_55%,rgba(0,0,0,0.08))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[22px] bg-[linear-gradient(135deg,#efe1ce_0%,#a27a58_42%,#68774e_100%)] text-xl font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              V
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-[2rem] leading-none text-white">Ventolivo</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/56">
                {dictionary.admin.badge}
              </p>
            </div>
          </div>

          {dismiss ? (
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/10 text-white/82 transition-colors hover:bg-white/16"
              aria-label="Close navigation"
            >
              <CloseIcon />
            </button>
          ) : null}
        </div>

        {sessionSummary ? (
          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/14 p-4">
            <p className="text-[10px] uppercase tracking-[0.26em] text-white/42">Session owner</p>
            <p className="mt-3 text-sm font-medium text-white/92">{sessionSummary.username}</p>
            <p className="mt-2 text-xs leading-5 text-white/58">{sessionSummary.expiresLabel}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="mb-3 px-1 text-[10px] uppercase tracking-[0.28em] text-white/42">
          Navigation
        </p>
        {navItems && navItems.length > 0 ? (
          <nav className="grid gap-2.5">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between gap-3 rounded-[22px] border px-4 py-3.5 transition-all ${
                  item.active
                    ? "border-[#e6d4bf]/18 bg-[linear-gradient(135deg,rgba(236,216,192,0.18),rgba(124,140,94,0.22))] text-white shadow-[0_22px_40px_rgba(0,0,0,0.2)]"
                    : "border-white/8 bg-white/[0.045] text-white/72 hover:border-white/14 hover:bg-white/[0.09] hover:text-white"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-[16px] border text-[11px] tracking-[0.18em] transition-colors ${
                      item.active
                        ? "border-white/12 bg-white/12 text-white/90"
                        : "border-white/8 bg-black/12 text-white/52 group-hover:bg-white/12 group-hover:text-white/76"
                    }`}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="truncate text-sm font-medium">{item.label}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-white/42 group-hover:text-white/72">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.active ? "bg-[#ead6be]" : "bg-white/18"}`} />
                  <ChevronIcon />
                </span>
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="relative mt-6 grid gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Workspace state</p>
        <div className="grid gap-3">
          {accentStats.map((stat) => (
            <div key={stat.label} className="rounded-[20px] border border-white/8 bg-black/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{stat.label}</p>
              <p className="mt-2 text-sm text-white/86">{stat.value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-7 text-white/62">{description}</p>
      </div>
    </>
  );
}

export default function AdminShellFrame({
  locale,
  dictionary,
  title,
  description,
  children,
  supportedLocales,
  activeItemLabel,
  sessionSummary,
  navItems,
  primaryAction,
  secondaryAction,
  immersivePreview = false,
  logoutAction,
}: AdminShellFrameProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(!immersivePreview);
  const navCount = navItems?.length ?? 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.52),transparent_22%),radial-gradient(circle_at_top_right,rgba(236,216,192,0.42),transparent_20%),linear-gradient(180deg,#f8f3ed_0%,#f1e7dc_44%,#eadfce_100%)] p-4 md:p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[12vh] h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute right-[-5rem] top-[8vh] h-72 w-72 rounded-full bg-[#d8c0a6]/18 blur-3xl" />
        <div className="absolute bottom-[8vh] right-[8vw] h-64 w-64 rounded-full bg-olive/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 rounded-[30px] border border-white/55 bg-white/62 px-5 py-4 shadow-[0_18px_48px_rgba(71,49,30,0.08)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/78 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-brown/82">
            <span className="h-2 w-2 rounded-full bg-olive" />
            {dictionary.admin.badge}
          </span>
          {activeItemLabel ? (
            <span className="rounded-full border border-brown/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(248,243,237,0.95))] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-brown/78">
              {activeItemLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-brown/62">
          <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">Locale / {locale.toUpperCase()}</span>
          <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">Views / {navCount.toString().padStart(2, "0")}</span>
          <span className="rounded-full border border-brown/10 bg-white/72 px-3 py-2">Languages / {supportedLocales.length.toString().padStart(2, "0")}</span>
        </div>
      </div>

      <div className={`relative mx-auto mt-5 w-full max-w-[1600px] gap-5 ${immersivePreview ? "relative" : "grid min-h-[calc(100vh-7rem)] lg:grid-cols-[330px_minmax(0,1fr)]"}`}>
        {immersivePreview ? (
          <>
            <div
              className={`fixed inset-0 z-30 bg-[#23180f]/34 backdrop-blur-[4px] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside
              className={`fixed bottom-4 left-4 top-4 z-40 flex h-auto w-[min(340px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,#271b12_0%,#2c1f14_34%,#35261a_100%)] p-5 text-white shadow-[0_36px_90px_rgba(0,0,0,0.28)] transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)]"}`}
            >
              <SidebarContent
                title={title}
                description={description}
                dictionary={dictionary}
                navItems={navItems}
                activeItemLabel={activeItemLabel}
                sessionSummary={sessionSummary}
                dismiss={() => setIsSidebarOpen(false)}
              />
            </aside>
          </>
        ) : (
          <aside className="relative flex h-full flex-col overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,#271b12_0%,#2c1f14_34%,#35261a_100%)] p-5 text-white shadow-[0_36px_90px_rgba(0,0,0,0.24)] lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
            <SidebarContent
              title={title}
              description={description}
              dictionary={dictionary}
              navItems={navItems}
              activeItemLabel={activeItemLabel}
              sessionSummary={sessionSummary}
            />
          </aside>
        )}

        <div className="flex min-w-0 flex-col gap-5">
          <section className="relative overflow-hidden rounded-[42px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(250,245,239,0.96)_38%,rgba(239,230,220,0.96)_100%)] p-6 shadow-[0_30px_80px_rgba(71,49,30,0.12)] md:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_68%)]" />
            <div className="pointer-events-none absolute -left-12 top-10 h-44 w-44 rounded-full bg-white/36 blur-3xl" />
            <div className="pointer-events-none absolute right-6 top-10 h-52 w-52 rounded-full bg-[#e0d3c3]/42 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-[38%] bg-[radial-gradient(circle_at_bottom_right,rgba(124,140,94,0.18),transparent_58%)]" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  {immersivePreview ? (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-brown/12 bg-white/84 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-brown/86 shadow-[0_14px_30px_rgba(71,49,30,0.07)] transition-colors hover:bg-white"
                    >
                      <MenuIcon />
                      Navigation
                    </button>
                  ) : null}
                  <span className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/76 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-brown/82">
                    <span className="h-2 w-2 rounded-full bg-olive" />
                    Premium workspace
                  </span>
                </div>

                <h1 className="mt-6 max-w-4xl font-serif text-[3rem] leading-[0.92] text-dark md:text-[4.4rem]">{title}</h1>
                <p className="mt-5 max-w-3xl text-sm leading-8 text-text/78 md:text-[15px]">{description}</p>

                {navItems && navItems.length > 0 ? (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-all ${
                          item.active
                            ? "border-transparent bg-[linear-gradient(135deg,#876140_0%,#6f8456_100%)] text-white shadow-[0_16px_32px_rgba(71,49,30,0.16)]"
                            : "border-brown/12 bg-white/74 text-brown/76 hover:-translate-y-0.5 hover:bg-white"
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
                  <div className="rounded-[30px] border border-white/55 bg-white/76 p-5 shadow-[0_18px_40px_rgba(71,49,30,0.08)] backdrop-blur">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Session state</p>
                    <p className="mt-3 font-serif text-3xl text-dark">{sessionSummary.username}</p>
                    <p className="mt-3 text-sm leading-7 text-text/70">{sessionSummary.expiresLabel}</p>
                  </div>
                ) : null}

                <div className="rounded-[30px] border border-brown/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(249,244,238,0.96))] p-5 shadow-[0_18px_40px_rgba(71,49,30,0.08)]">
                  <div className="grid gap-3">
                    <AdminLocaleSwitcher currentLocale={locale} locales={supportedLocales} label={dictionary.admin.shell.localeSwitcher} />
                    {secondaryAction ? (
                      <Link
                        href={secondaryAction.href}
                        className="rounded-[20px] border border-brown/12 bg-white/84 px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-brown transition-all hover:-translate-y-0.5 hover:bg-white"
                      >
                        {secondaryAction.label}
                      </Link>
                    ) : null}
                    {primaryAction ? (
                      <Link
                        href={primaryAction.href}
                        className="rounded-[20px] bg-[linear-gradient(135deg,#876140_0%,#6f8456_100%)] px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(71,49,30,0.18)] transition-transform hover:-translate-y-0.5"
                      >
                        {primaryAction.label}
                      </Link>
                    ) : null}
                    <form action={logoutAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="w-full rounded-[20px] border border-brown/12 bg-transparent px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
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
