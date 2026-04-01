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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#efe0c9_0%,#f7f1e8_45%,#f3ecdf_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[32px] border border-brown/10 bg-white shadow-[0_30px_80px_rgba(44,31,20,0.10)] lg:grid-cols-[1fr_0.9fr]">
          <div className="bg-[linear-gradient(135deg,#2c1f14_0%,#6b4f3a_100%)] p-10 text-white">
            <p className="text-[12px] uppercase tracking-[0.24em] text-white/70">
              {dictionary.admin.badge}
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-none">
              Secure admin login
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Sign in to access the admin workspace, manage multilingual product
              content, and prepare the catalog for future operational tools.
            </p>
          </div>
          <div className="p-10">
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              Welcome back
            </p>
            <h2 className="mt-3 font-serif text-4xl text-dark">Sign in</h2>
            {error ? (
              <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700">
                Invalid credentials. Please try again.
              </p>
            ) : null}
            {status === "logged-out" ? (
              <p className="mt-4 rounded-2xl border border-olive/20 bg-olive/10 px-4 py-3 text-sm text-olive">
                You have been signed out successfully.
              </p>
            ) : null}
            <form action={loginAdminAction} className="mt-8 flex flex-col gap-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={next ?? ""} />
              <label className="flex flex-col gap-2 text-sm text-dark">
                <span className="uppercase tracking-[0.16em] text-muted">Username</span>
                <input
                  name="username"
                  required
                  className="border border-brown/20 bg-cream/30 px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-dark">
                <span className="uppercase tracking-[0.16em] text-muted">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  className="border border-brown/20 bg-cream/30 px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </label>
              <button
                type="submit"
                className="mt-4 rounded-full bg-brown px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
              >
                Sign in
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
