import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession, getAdminSessionRecoveryPath } from "@/services/admin-auth";
import { getAdminNavItems } from "@/services/admin";
import { getCustomerAdminInsights } from "@/services/customer-auth";

export default async function AdminCustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, session] = await Promise.all([getDictionary(locale), getAdminSession()]);

  if (!session) {
    redirect(
      getAdminSessionRecoveryPath({
        locale,
        next: `/${locale}/admin/customers`,
      }),
    );
  }

  const insights = await getCustomerAdminInsights({
    recentUsersLimit: 12,
    recentIntentsLimit: 24,
    windowDays: 30,
  });

  const cards = [
    {
      label: dictionary.admin.customers.usersBadge,
      value: insights.totals.users.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(239,228,215,0.95))]",
    },
    {
      label: dictionary.admin.customers.intentsBadge,
      value: insights.totals.intents.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(223,229,212,0.72),rgba(255,255,255,0.94))]",
    },
    {
      label: dictionary.admin.customers.intentsWindow,
      value: insights.totals.intentsInWindow.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(122,86,56,0.12),rgba(255,255,255,0.94))]",
    },
    {
      label: dictionary.admin.customers.activeBuyersWindow,
      value: insights.totals.activeBuyersInWindow.toString().padStart(2, "0"),
      accent: "bg-[linear-gradient(135deg,rgba(218,208,195,0.42),rgba(255,255,255,0.94))]",
    },
  ];

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      title={dictionary.admin.customers.title}
      description={dictionary.admin.customers.description}
      sessionSummary={{
        username: session.user.username,
        expiresLabel: `${dictionary.admin.dashboard.sessionExpires}: ${session.expiresAt.toLocaleString(locale)}`,
      }}
      navItems={getAdminNavItems(locale, "customers", dictionary.admin.navigation)}
      primaryAction={{
        href: `/${locale}/admin/products`,
        label: dictionary.admin.navigation.products,
      }}
      secondaryAction={{
        href: `/${locale}/admin`,
        label: dictionary.admin.navigation.dashboard,
      }}
    >
      <section className="rounded-[34px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.84),rgba(239,228,215,0.92)_56%,rgba(255,255,255,0.88)_100%)] p-7 shadow-[0_24px_54px_rgba(107,79,58,0.1)] md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-brown/82">
          <span className="h-2 w-2 rounded-full bg-olive" />
          {dictionary.admin.customers.title}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-text/74">
          {dictionary.admin.customers.description}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className={`rounded-[24px] border border-white/45 p-5 shadow-[0_16px_30px_rgba(107,79,58,0.08)] ${card.accent}`}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{card.label}</p>
              <p className="mt-4 font-serif text-4xl leading-none text-dark">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[34px] border border-white/55 bg-white/84 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
          <h2 className="font-serif text-4xl text-dark">
            {dictionary.admin.customers.recentUsersTitle}
          </h2>
          <div className="mt-6 grid gap-4">
            {insights.recentUsers.length === 0 ? (
              <p className="rounded-[24px] border border-dashed border-brown/20 bg-[linear-gradient(180deg,rgba(255,252,247,0.72),rgba(239,228,215,0.58))] p-5 text-sm text-text/72">
                {dictionary.admin.customers.noRecentUsers}
              </p>
            ) : (
              insights.recentUsers.map((user) => (
                <article
                  key={user.id}
                  className="rounded-[24px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.76),rgba(239,228,215,0.78))] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-serif text-2xl text-dark">{user.fullName}</h3>
                    <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-brown/70">
                      #{user.id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-text/74">{user.email}</p>
                  {user.phone ? <p className="mt-1 text-sm text-text/70">{user.phone}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-brown/70">
                      {user.intentCount} intents
                    </span>
                    <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-brown/70">
                      {user.marketingConsent
                        ? dictionary.admin.customers.marketingConsent
                        : dictionary.admin.customers.noMarketingConsent}
                    </span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-brown/55">
                    {user.createdAt.toLocaleString(locale)}
                  </p>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[34px] border border-white/55 bg-white/84 p-6 shadow-[0_24px_50px_rgba(107,79,58,0.1)] md:p-8">
          <h2 className="font-serif text-4xl text-dark">
            {dictionary.admin.customers.recentIntentsTitle}
          </h2>
          <div className="mt-6 grid gap-4">
            {insights.recentIntents.length === 0 ? (
              <p className="rounded-[24px] border border-dashed border-brown/20 bg-[linear-gradient(180deg,rgba(255,252,247,0.72),rgba(239,228,215,0.58))] p-5 text-sm text-text/72">
                {dictionary.admin.customers.noRecentIntents}
              </p>
            ) : (
              insights.recentIntents.map((intent) => (
                <article
                  key={intent.id}
                  className="rounded-[24px] border border-brown/10 bg-[linear-gradient(135deg,rgba(255,252,247,0.76),rgba(239,228,215,0.78))] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-serif text-2xl text-dark">
                      {intent.product?.name ?? dictionary.admin.customers.unknownProduct}
                    </h3>
                    <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-brown/70">
                      {intent.channel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-text/74">
                    {intent.customer
                      ? `${intent.customer.fullName} / ${intent.customer.email}`
                      : dictionary.admin.customers.anonymousCustomer}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-brown/70">
                      {intent.locale.toUpperCase()}
                    </span>
                    {intent.source ? (
                      <span className="rounded-full border border-brown/10 bg-white/74 px-3 py-2 text-brown/70">
                        {intent.source}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-brown/55">
                    {intent.createdAt.toLocaleString(locale)}
                  </p>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
