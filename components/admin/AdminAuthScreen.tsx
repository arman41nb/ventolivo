import type { ReactNode } from "react";

interface AdminAuthScreenProps {
  badge: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroCards: Array<{
    eyebrow: string;
    value: string;
  }>;
  formKicker: string;
  formTitle: string;
  alerts?: Array<{
    tone: "error" | "success" | "info";
    text: string;
  }>;
  children: ReactNode;
  footer?: ReactNode;
}

const alertStyles: Record<NonNullable<AdminAuthScreenProps["alerts"]>[number]["tone"], string> = {
  error: "border-red-500/20 bg-red-50 text-red-700",
  success: "border-olive/20 bg-olive/10 text-olive",
  info: "border-brown/10 bg-white/72 text-text/78",
};

export default function AdminAuthScreen({
  badge,
  heroKicker,
  heroTitle,
  heroDescription,
  heroCards,
  formKicker,
  formTitle,
  alerts = [],
  children,
  footer,
}: AdminAuthScreenProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.48),transparent_26%),linear-gradient(180deg,#f6f0e8_0%,#f1e7dc_52%,#eadfce_100%)] px-6 py-10">
      <div className="mx-auto mb-4 flex w-full max-w-6xl justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-brown/80 shadow-[0_16px_36px_rgba(107,79,58,0.08)] backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-olive" />
          {badge}
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
                {heroKicker}
              </p>
              <h1 className="mt-6 max-w-lg font-serif text-5xl leading-[0.92] md:text-6xl">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/78">{heroDescription}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {heroCards.map((card) => (
                  <div
                    key={`${card.eyebrow}-${card.value}`}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">
                      {card.eyebrow}
                    </p>
                    <p className="mt-3 font-serif text-3xl text-white">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 md:p-12">
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">{formKicker}</p>
            <h2 className="mt-3 font-serif text-4xl text-dark md:text-5xl">{formTitle}</h2>

            {alerts.length > 0 ? (
              <div className="mt-5 flex flex-col gap-3">
                {alerts.map((alert, index) => (
                  <p
                    key={`${alert.tone}-${index}`}
                    className={`rounded-[22px] border px-4 py-3 text-sm ${alertStyles[alert.tone]}`}
                  >
                    {alert.text}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
