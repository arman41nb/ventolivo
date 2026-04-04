import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
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
  const dictionary = await getDictionary(locale);
  const { error, status, next } = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.48),transparent_26%),linear-gradient(180deg,#f6f0e8_0%,#f1e7dc_52%,#eadfce_100%)] px-6 py-10">
      <div className="mx-auto mb-4 flex w-full max-w-6xl justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-brown/80 shadow-[0_16px_36px_rgba(107,79,58,0.08)] backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-olive" />
          {dictionary.admin.badge}
        </div>
      </div>

      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[40px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.88),rgba(242,234,224,0.9)_52%,rgba(233,223,211,0.94)_100%)] shadow-[0_34px_90px_rgba(44,31,20,0.12)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#2c1f14_0%,#6b4f3a_62%,#7c8c5e_100%)] p-10 text-white md:p-12">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)]" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/74">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                {dictionary.admin.login.kicker}
              </p>
              <h1 className="mt-6 max-w-lg font-serif text-5xl leading-[0.92] md:text-6xl">
                {dictionary.admin.login.title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/78">
                {dictionary.admin.login.description}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">
                    {dictionary.admin.badge}
                  </p>
                  <p className="mt-3 font-serif text-3xl text-white">
                    {dictionary.admin.login.submit}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">
                    /{locale.toUpperCase()}
                  </p>
                  <p className="mt-3 font-serif text-3xl text-white">
                    {dictionary.admin.login.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-12">
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              {dictionary.admin.login.submit}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-dark md:text-5xl">
              {dictionary.admin.badge}
            </h2>
            {error ? (
              <p className="mt-5 rounded-[22px] border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700">
                {dictionary.admin.login.invalidCredentials}
              </p>
            ) : null}
            {status === "logged-out" ? (
              <p className="mt-5 rounded-[22px] border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
                {dictionary.admin.login.loggedOut}
              </p>
            ) : null}
            <form action={loginAdminAction} className="mt-8 flex flex-col gap-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={next ?? ""} />
              <label className="flex flex-col gap-2 text-sm text-dark">
                <span className="uppercase tracking-[0.16em] text-muted">
                  {dictionary.admin.login.username}
                </span>
                <input
                  name="username"
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
            <p className="mt-6 rounded-[22px] border border-brown/10 bg-white/62 px-4 py-4 text-sm leading-7 text-text/72">
              {dictionary.admin.login.bootstrapHint}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
