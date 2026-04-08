"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import {
  baseSiteLocaleCode,
  getSiteLocaleCatalog,
  getSiteLocaleFlag,
  getSiteLocaleNativeLabel,
  getSiteLocalePreset,
  inferSiteLocaleDirection,
  inferSiteLocaleLabel,
  isValidSiteLocaleCode,
  normalizeSiteLocaleCode,
  type SiteLocalePreset,
} from "@/modules/site-content";
import type { SiteLocaleConfig, SiteLocaleDirection } from "@/types";

interface SiteLocalesManagerProps {
  currentLocale: string;
  locales: SiteLocaleConfig[];
  dictionary: Dictionary["admin"]["siteLocalesManager"];
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

function matchesLocalePresetSearch(preset: SiteLocalePreset, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [preset.code, preset.label, preset.nativeLabel, ...(preset.aliases ?? [])]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

export default function SiteLocalesManager({
  currentLocale,
  locales,
  dictionary,
}: SiteLocalesManagerProps) {
  const [draftLocales, setDraftLocales] = useState<SiteLocaleConfig[]>(sortLocales(locales));
  const [searchQuery, setSearchQuery] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDirection, setNewDirection] = useState<SiteLocaleDirection>("ltr");
  const [error, setError] = useState("");

  const normalizedJson = useMemo(() => JSON.stringify(sortLocales(draftLocales)), [draftLocales]);
  const localeCatalog = useMemo(() => getSiteLocaleCatalog(), []);
  const selectedPreset = getSiteLocalePreset(newCode);
  const stagedLocaleCodes = useMemo(
    () => new Set(draftLocales.map((locale) => locale.code)),
    [draftLocales],
  );
  const availablePresets = useMemo(
    () =>
      localeCatalog
        .filter((preset) => !stagedLocaleCodes.has(preset.code))
        .filter((preset) => matchesLocalePresetSearch(preset, searchQuery))
        .slice(0, 12),
    [localeCatalog, searchQuery, stagedLocaleCodes],
  );

  function stagePreset(preset: SiteLocalePreset) {
    setNewCode(preset.code);
    setNewLabel(preset.label);
    setNewDirection(preset.direction);
    setSearchQuery(preset.label);
    setManualMode(false);
    setError("");
  }

  function resetComposer() {
    setNewCode("");
    setNewLabel("");
    setNewDirection("ltr");
    setSearchQuery("");
    setManualMode(false);
    setError("");
  }

  function addLocale() {
    const normalizedCode = normalizeSiteLocaleCode(newCode);
    const preset = getSiteLocalePreset(normalizedCode);
    const normalizedLabel =
      newLabel.trim() || preset?.label || inferSiteLocaleLabel(normalizedCode);

    if (!isValidSiteLocaleCode(normalizedCode)) {
      setError(dictionary.invalidLocale);
      return;
    }

    if (draftLocales.some((locale) => locale.code === normalizedCode)) {
      setError(dictionary.duplicateLocale);
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
    resetComposer();
  }

  function removeLocale(code: string) {
    if (code === baseSiteLocaleCode) {
      return;
    }

    setDraftLocales((currentLocales) => currentLocales.filter((locale) => locale.code !== code));
  }

  function updateLocale(code: string, patch: Partial<SiteLocaleConfig>) {
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

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.24em] text-muted">{dictionary.badge}</p>
          <h3 className="mt-2 font-serif text-2xl text-dark">{dictionary.title}</h3>
          <p className="mt-3 max-w-2xl text-sm text-text/75">{dictionary.description}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-4 py-2 text-xs uppercase tracking-[0.16em] text-amber-900">
          {dictionary.stagedUntilSave}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
          {draftLocales.length} {dictionary.activeLanguages}
        </span>
        <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
          {dictionary.baseLocaleLocked}
        </span>
      </div>

      <div className="mt-5 grid gap-4">
        {draftLocales.map((locale) => {
          const isBaseLocale = locale.code === baseSiteLocaleCode;
          const isCurrentLocale = locale.code === currentLocale;
          const nativeLabel = getSiteLocaleNativeLabel(locale.code);

          return (
            <article
              key={locale.code}
              className="rounded-[22px] border border-brown/10 bg-cream/35 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.16em] text-brown">
                      {getSiteLocaleFlag(locale.code)} {locale.code.toUpperCase()}
                    </span>
                    {isBaseLocale ? (
                      <span className="rounded-full bg-olive/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-olive">
                        {dictionary.baseLocale}
                      </span>
                    ) : null}
                    {isCurrentLocale ? (
                      <span className="rounded-full bg-brown px-3 py-1 text-xs uppercase tracking-[0.16em] text-white">
                        {dictionary.currentEditor}
                      </span>
                    ) : null}
                  </div>
                  <h4 className="mt-3 font-serif text-xl text-dark">{locale.label}</h4>
                  <p className="mt-1 text-sm text-text/70">
                    {nativeLabel !== locale.label
                      ? `${nativeLabel} • ${locale.direction.toUpperCase()}`
                      : locale.direction.toUpperCase()}
                  </p>
                  <p className="mt-2 text-sm text-text/75">{dictionary.localeHelp}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${locale.code}/admin/site`}
                    className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    {dictionary.openInStudio}
                  </Link>
                  {!isBaseLocale ? (
                    <button
                      type="button"
                      onClick={() => removeLocale(locale.code)}
                      className="rounded-full border border-red-600/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-red-700 transition-colors hover:bg-red-50"
                    >
                      {dictionary.removeFromDraft}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="uppercase tracking-[0.16em] text-muted">{dictionary.label}</span>
                  <input
                    value={locale.label}
                    disabled={isBaseLocale}
                    onChange={(event) => updateLocale(locale.code, { label: event.target.value })}
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown disabled:bg-cream/60"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="uppercase tracking-[0.16em] text-muted">
                    {dictionary.direction}
                  </span>
                  <select
                    value={locale.direction}
                    onChange={(event) =>
                      updateLocale(locale.code, {
                        direction: event.target.value === "rtl" ? "rtl" : "ltr",
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
              {dictionary.addLanguage}
            </p>
            <h4 className="mt-2 font-serif text-xl text-dark">{dictionary.addLanguageTitle}</h4>
            <p className="mt-2 max-w-2xl text-sm text-text/75">
              {dictionary.addLanguageDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setManualMode((current) => !current);
              setError("");
            }}
            className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
          >
            {manualMode ? dictionary.usePresetPicker : dictionary.addCustomLocale}
          </button>
        </div>

        {!manualMode ? (
          <div className="mt-5">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                {dictionary.findLanguage}
              </span>
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setError("");
                }}
                placeholder={dictionary.searchPlaceholder}
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {availablePresets.length > 0 ? (
                availablePresets.map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => stagePreset(preset)}
                    className={`rounded-[18px] border px-4 py-4 text-left transition-colors ${
                      preset.code === normalizeSiteLocaleCode(newCode)
                        ? "border-brown bg-white shadow-sm"
                        : "border-brown/15 bg-white/70 hover:border-brown/30 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-dark">
                          {preset.flag} {preset.label}
                        </p>
                        <p className="mt-1 text-sm text-text/70">{preset.nativeLabel}</p>
                      </div>
                      <span className="rounded-full bg-cream px-3 py-1 text-xs uppercase tracking-[0.14em] text-brown">
                        {preset.code}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">
                      {preset.direction}
                    </p>
                  </button>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-brown/20 bg-white px-4 py-5 text-sm text-text/70 md:col-span-2">
                  {dictionary.noPresetResults}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="mt-5 rounded-[18px] border border-brown/10 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                {dictionary.stagedDraft}
              </p>
              {newCode ? (
                <div className="mt-2">
                  <p className="text-lg font-medium text-dark">
                    {getSiteLocaleFlag(newCode)} {newLabel.trim() || inferSiteLocaleLabel(newCode)}
                  </p>
                  <p className="mt-1 text-sm text-text/70">
                    {getSiteLocaleNativeLabel(newCode)} •{" "}
                    {normalizeSiteLocaleCode(newCode).toUpperCase()} • {newDirection.toUpperCase()}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-text/70">{dictionary.draftPlaceholder}</p>
              )}
            </div>
            {newCode ? (
              <button
                type="button"
                onClick={resetComposer}
                className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
              >
                {dictionary.clearDraft}
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[140px_minmax(0,1fr)_140px_auto]">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">{dictionary.code}</span>
              <input
                value={newCode}
                readOnly={Boolean(selectedPreset) && !manualMode}
                onChange={(event) => {
                  const code = event.target.value;
                  const preset = getSiteLocalePreset(code);
                  setNewCode(code);
                  setNewDirection(preset?.direction ?? inferSiteLocaleDirection(code));
                  if (!newLabel.trim() && preset) {
                    setNewLabel(preset.label);
                  }
                  setError("");
                }}
                placeholder="es"
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown read-only:bg-cream/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">{dictionary.label}</span>
              <input
                value={newLabel}
                onChange={(event) => {
                  setNewLabel(event.target.value);
                  setError("");
                }}
                placeholder="Spanish"
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">{dictionary.direction}</span>
              <select
                value={newDirection}
                onChange={(event) => setNewDirection(event.target.value === "rtl" ? "rtl" : "ltr")}
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
                {dictionary.saveToDraft}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-700">{error}</p>
        ) : (
          <p className="mt-3 text-sm text-text/70">{dictionary.draftSavedHint}</p>
        )}
      </div>
    </section>
  );
}
