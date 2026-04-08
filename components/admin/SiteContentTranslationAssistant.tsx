"use client";

import { useMemo, useState } from "react";
import { getSiteLocaleFlag, getSiteLocaleNativeLabel } from "@/modules/site-content";
import type { Dictionary } from "@/i18n/types";
import { siteContentTranslationKeys } from "@/modules/site-content";
import type { SiteContentLocaleFields, SiteLocaleConfig } from "@/types";

interface SiteContentTranslationAssistantProps {
  currentLocale: string;
  locales: SiteLocaleConfig[];
  dictionary: Dictionary["admin"]["siteTranslationAssistant"];
}

type TranslationProviders = Partial<Record<string, "libretranslate" | "mymemory">>;

export default function SiteContentTranslationAssistant({
  currentLocale,
  locales,
  dictionary,
}: SiteContentTranslationAssistantProps) {
  const [sourceLocale, setSourceLocale] = useState(currentLocale);
  const [selectedLocales, setSelectedLocales] = useState(
    locales.map((locale) => locale.code).filter((locale) => locale !== currentLocale),
  );
  const [onlyEmptyFields, setOnlyEmptyFields] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [translations, setTranslations] = useState<
    Partial<Record<string, SiteContentLocaleFields>>
  >({});

  const translationsJson = useMemo(() => JSON.stringify(translations), [translations]);
  const targetLocales = useMemo(
    () => selectedLocales.filter((locale) => locale !== sourceLocale),
    [selectedLocales, sourceLocale],
  );
  const stagedTranslationsCount = Object.keys(translations).length;

  function toggleLocale(locale: string) {
    setSelectedLocales((currentLocales) =>
      currentLocales.includes(locale)
        ? currentLocales.filter((item) => item !== locale)
        : [...currentLocales, locale],
    );
    setStatus("");
  }

  async function handleTranslate(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.closest("form");

    if (!form) {
      return;
    }

    const fields = Object.fromEntries(
      siteContentTranslationKeys.map((field) => {
        const element = form.querySelector(`[name="${field}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;

        return [field, element?.value ?? ""];
      }),
    ) as SiteContentLocaleFields;

    if (siteContentTranslationKeys.some((field) => !fields[field].trim())) {
      setStatus(dictionary.fillCurrentFields);
      return;
    }

    if (targetLocales.length === 0) {
      setStatus(dictionary.selectTargetLanguage);
      return;
    }

    setLoading(true);
    setStatus(dictionary.translating);

    try {
      const response = await fetch("/api/admin/translate-site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLocale,
          targetLocales,
          fields,
        }),
      });

      const result = (await response.json()) as {
        translations?: Partial<Record<string, SiteContentLocaleFields>>;
        providers?: TranslationProviders;
        error?: string;
      };

      if (!response.ok || !result.translations) {
        throw new Error(result.error || "Translation failed");
      }

      setTranslations((currentTranslations) => {
        const nextTranslations = { ...currentTranslations };

        for (const [locale, translatedFields] of Object.entries(result.translations ?? {})) {
          if (!translatedFields) {
            continue;
          }

          nextTranslations[locale] = Object.fromEntries(
            siteContentTranslationKeys.map((field) => [
              field,
              onlyEmptyFields && currentTranslations[locale]?.[field]?.trim().length
                ? currentTranslations[locale]?.[field]
                : translatedFields[field],
            ]),
          ) as SiteContentLocaleFields;
        }

        return nextTranslations;
      });

      const providers = result.providers
        ? Array.from(new Set(Object.values(result.providers)))
        : [];
      const providerLabel =
        providers.length > 0 ? ` ${dictionary.providerPrefix}: ${providers.join(", ")}.` : "";

      setStatus(`${dictionary.ready}${providerLabel}`);
    } catch {
      setStatus(dictionary.unavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
      <input type="hidden" name="translatedSiteContentJson" value={translationsJson} />

      <p className="text-[12px] uppercase tracking-[0.24em] text-muted">{dictionary.badge}</p>
      <h3 className="mt-2 font-serif text-2xl text-dark">{dictionary.title}</h3>
      <p className="mt-3 text-sm text-text/75">{dictionary.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
          {targetLocales.length} {dictionary.targetLanguagesSelected}
        </span>
        <span className="rounded-full bg-olive/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-olive">
          {stagedTranslationsCount} {dictionary.stagedTranslationSets}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.sourceLanguage}
          </span>
          <select
            value={sourceLocale}
            onChange={(event) => {
              setSourceLocale(event.target.value);
              setStatus("");
            }}
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          >
            {locales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {getSiteLocaleFlag(locale.code)} {locale.label} ({locale.code.toUpperCase()})
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {dictionary.targetLanguages}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {locales
              .filter((locale) => locale.code !== sourceLocale)
              .map((locale) => {
                const selected = selectedLocales.includes(locale.code);

                return (
                  <button
                    key={locale.code}
                    type="button"
                    onClick={() => toggleLocale(locale.code)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                      selected
                        ? "border-brown bg-brown text-white"
                        : "border-brown/20 bg-white text-brown hover:bg-brown/5"
                    }`}
                  >
                    {getSiteLocaleFlag(locale.code)} {locale.label}
                  </button>
                );
              })}
          </div>
          {targetLocales.length > 0 ? (
            <p className="mt-3 text-sm text-text/70">
              {targetLocales
                .map(
                  (localeCode) =>
                    `${getSiteLocaleFlag(localeCode)} ${getSiteLocaleNativeLabel(localeCode)} (${localeCode.toUpperCase()})`,
                )
                .join(", ")}
            </p>
          ) : null}
        </div>

        <label className="inline-flex items-center gap-3 text-sm text-dark">
          <input
            type="checkbox"
            checked={onlyEmptyFields}
            onChange={(event) => setOnlyEmptyFields(event.target.checked)}
            className="h-4 w-4 accent-brown"
          />
          {dictionary.onlyEmptyFields}
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading}
            className="rounded-full bg-olive px-5 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {loading ? dictionary.translating : dictionary.translateButton}
          </button>
        </div>
      </div>

      {status ? <p className="mt-4 text-sm text-text/75">{status}</p> : null}
    </section>
  );
}
