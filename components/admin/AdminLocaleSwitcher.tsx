"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { SiteLocaleConfig } from "@/types";

interface AdminLocaleSwitcherProps {
  currentLocale: string;
  locales: SiteLocaleConfig[];
  label: string;
}

export default function AdminLocaleSwitcher({
  currentLocale,
  locales,
  label,
}: AdminLocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const visibleLocales = useMemo(
    () => locales.filter((locale) => locale.code.trim().length > 0),
    [locales],
  );

  if (visibleLocales.length <= 1) {
    return null;
  }

  function handleLocaleChange(nextLocale: string) {
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = nextLocale;
    }

    const query = searchParams.toString();
    const nextPath = query ? `${segments.join("/")}?${query}` : segments.join("/");
    router.push(nextPath);
  }

  return (
    <label className="grid gap-2 rounded-[18px] border border-brown/10 bg-white/76 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-brown/78 shadow-[0_12px_24px_rgba(107,79,58,0.04)]">
      <span>{label}</span>
      <select
        value={currentLocale}
        onChange={(event) => handleLocaleChange(event.target.value)}
        className="rounded-[12px] border border-brown/10 bg-cream/50 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-dark outline-none"
        aria-label={label}
      >
        {visibleLocales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.code.toUpperCase()} {locale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
