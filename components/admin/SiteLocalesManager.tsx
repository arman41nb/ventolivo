"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  baseSiteLocaleCode,
  inferSiteLocaleDirection,
  inferSiteLocaleLabel,
  isValidSiteLocaleCode,
  normalizeSiteLocaleCode,
} from "@/modules/site-content/locales";
import type { SiteLocaleConfig, SiteLocaleDirection } from "@/types";

interface SiteLocalesManagerProps {
  currentLocale: string;
  locales: SiteLocaleConfig[];
}

function sortLocales(locales: SiteLocaleConfig[]): SiteLocaleConfig[] {
  return [...locales].sort((left, right) => {
    if (left.code === baseSiteLocaleCode) {
      return -1;
    }

    if (right.code === baseSiteLocaleCode) {
      return 1;
    }

    return left.label.localeCompare(right.label);
  });
}

export default function SiteLocalesManager({
  currentLocale,
  locales,
}: SiteLocalesManagerProps) {
  const [draftLocales, setDraftLocales] = useState<SiteLocaleConfig[]>(
    sortLocales(locales),
  );
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDirection, setNewDirection] =
    useState<SiteLocaleDirection>("ltr");
  const [error, setError] = useState("");

  const normalizedJson = useMemo(
    () => JSON.stringify(sortLocales(draftLocales)),
    [draftLocales],
  );

  function addLocale() {
    const normalizedCode = normalizeSiteLocaleCode(newCode);
    const normalizedLabel = newLabel.trim() || inferSiteLocaleLabel(newCode);

    if (!isValidSiteLocaleCode(normalizedCode)) {
      setError("Use a valid locale code like es, fr, or pt-br.");
      return;
    }

    if (draftLocales.some((locale) => locale.code === normalizedCode)) {
      setError("That language already exists in the site locale list.");
      return;
    }

    setDraftLocales((currentLocales) =>
      sortLocales([
        ...currentLocales,
        {
          code: normalizedCode,
          label: normalizedLabel,
          direction: newDirection,
        },
      ]),
    );
    setNewCode("");
    setNewLabel("");
    setNewDirection(inferSiteLocaleDirection(normalizedCode));
    setError("");
  }

  function removeLocale(code: string) {
    if (code === baseSiteLocaleCode) {
      return;
    }

    setDraftLocales((currentLocales) =>
      currentLocales.filter((locale) => locale.code !== code),
    );
  }

  function updateLocale(
    code: string,
    patch: Partial<SiteLocaleConfig>,
  ) {
    setDraftLocales((currentLocales) =>
      sortLocales(
        currentLocales.map((locale) =>
          locale.code === code
            ? {
                ...locale,
                ...patch,
              }
            : locale,
        ),
      ),
    );
  }

  return (
    <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
      <input type="hidden" name="siteLocalesJson" value={normalizedJson} />

      <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
        Languages
      </p>
      <h3 className="mt-2 font-serif text-2xl text-dark">
        Site locale registry
      </h3>
      <p className="mt-3 text-sm text-text/75">
        Add or remove storefront languages from the admin panel. The base
        locale stays locked to English so routing and content fallbacks remain
        stable.
      </p>

      <div className="mt-5 grid gap-4">
        {draftLocales.map((locale) => {
          const isBaseLocale = locale.code === baseSiteLocaleCode;
          const isCurrentLocale = locale.code === currentLocale;

          return (
            <article
              key={locale.code}
              className="rounded-[22px] border border-brown/10 bg-cream/35 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.16em] text-brown">
                      {locale.code.toUpperCase()}
                    </span>
                    {isBaseLocale ? (
                      <span className="rounded-full bg-olive/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-olive">
                        Base locale
                      </span>
                    ) : null}
                    {isCurrentLocale ? (
                      <span className="rounded-full bg-brown px-3 py-1 text-xs uppercase tracking-[0.16em] text-white">
                        Current editor
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-text/75">
                    Open this locale in the site studio or storefront preview.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${locale.code}/admin/site`}
                    className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    Open in studio
                  </Link>
                  {!isBaseLocale ? (
                    <button
                      type="button"
                      onClick={() => removeLocale(locale.code)}
                      className="rounded-full border border-red-600/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="uppercase tracking-[0.16em] text-muted">
                    Label
                  </span>
                  <input
                    value={locale.label}
                    disabled={isBaseLocale}
                    onChange={(event) =>
                      updateLocale(locale.code, { label: event.target.value })
                    }
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown disabled:bg-cream/60"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="uppercase tracking-[0.16em] text-muted">
                    Direction
                  </span>
                  <select
                    value={locale.direction}
                    onChange={(event) =>
                      updateLocale(locale.code, {
                        direction:
                          event.target.value === "rtl" ? "rtl" : "ltr",
                      })
                    }
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  >
                    <option value="ltr">LTR</option>
                    <option value="rtl">RTL</option>
                  </select>
                </label>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-[22px] border border-dashed border-brown/20 bg-cream/25 p-4">
        <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
          Add language
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-[140px_minmax(0,1fr)_140px_auto]">
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Code</span>
            <input
              value={newCode}
              onChange={(event) => {
                const code = event.target.value;
                setNewCode(code);
                setNewDirection(inferSiteLocaleDirection(code));
              }}
              placeholder="es"
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">Label</span>
            <input
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
              placeholder="Spanish"
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="uppercase tracking-[0.16em] text-muted">
              Direction
            </span>
            <select
              value={newDirection}
              onChange={(event) =>
                setNewDirection(
                  event.target.value === "rtl" ? "rtl" : "ltr",
                )
              }
              className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
            >
              <option value="ltr">LTR</option>
              <option value="rtl">RTL</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addLocale}
              className="w-full rounded-full bg-brown px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark"
            >
              Add
            </button>
          </div>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-red-700">{error}</p>
        ) : null}
      </div>
    </section>
  );
}
