"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/types";
import type { SiteLocaleConfig } from "@/types";

interface ProductTranslationAssistantProps {
  currentLocale: string;
  locales: SiteLocaleConfig[];
  dictionary: Dictionary["admin"]["translationAssistant"];
}

export default function ProductTranslationAssistant({
  currentLocale,
  locales,
  dictionary,
}: ProductTranslationAssistantProps) {
  const [sourceLocale, setSourceLocale] = useState(currentLocale);
  const [selectedLocales, setSelectedLocales] = useState<string[]>(
    locales
      .map((locale) => locale.code)
      .filter((locale) => locale !== currentLocale),
  );
  const [onlyEmptyFields, setOnlyEmptyFields] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function toggleLocale(locale: string) {
    setSelectedLocales((current) =>
      current.includes(locale)
        ? current.filter((item) => item !== locale)
        : [...current, locale],
    );
  }

  async function handleTranslate(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const form = event.currentTarget.closest("form");

    if (!form) {
      return;
    }

    const getValue = (name: string) =>
      (
        form.querySelector(`[name="${name}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null
      )?.value ?? "";

    const payload = {
      sourceLocale,
      targetLocales: selectedLocales.filter((locale) => locale !== sourceLocale),
      fields: {
        name: getValue("name"),
        tag: getValue("tag"),
        description: getValue("description"),
      },
    };

    if (
      !payload.fields.name.trim() ||
      !payload.fields.tag.trim() ||
      !payload.fields.description.trim()
    ) {
      setStatus(dictionary.fillBaseFields);
      return;
    }

    if (payload.targetLocales.length === 0) {
      setStatus(dictionary.selectTargetLanguage);
      return;
    }

    setLoading(true);
    setStatus(dictionary.translating);

    try {
      const response = await fetch("/api/admin/translate-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        translations?: Partial<
          Record<string, { name: string; tag: string; description: string }>
        >;
        providers?: Partial<Record<string, "libretranslate" | "mymemory">>;
        error?: string;
      };

      if (!response.ok || !result.translations) {
        throw new Error(result.error || "Translation failed");
      }

      for (const locale of Object.keys(result.translations) as string[]) {
        const translation = result.translations[locale];

        if (!translation) {
          continue;
        }

        const nameField = form.querySelector(
          `[name="translations.name.${locale}"]`,
        ) as HTMLInputElement | null;
        const tagField = form.querySelector(
          `[name="translations.tag.${locale}"]`,
        ) as HTMLInputElement | null;
        const descriptionField = form.querySelector(
          `[name="translations.description.${locale}"]`,
        ) as HTMLTextAreaElement | null;

        if (nameField && (!onlyEmptyFields || !nameField.value.trim())) {
          nameField.value = translation.name;
        }

        if (tagField && (!onlyEmptyFields || !tagField.value.trim())) {
          tagField.value = translation.tag;
        }

        if (
          descriptionField &&
          (!onlyEmptyFields || !descriptionField.value.trim())
        ) {
          descriptionField.value = translation.description;
        }
      }

      const providers = result.providers
        ? Array.from(new Set(Object.values(result.providers)))
        : [];
      const providerLabel =
        providers.length > 0
          ? ` ${dictionary.providerPrefix}: ${providers.join(", ")}.`
          : "";

      setStatus(`${dictionary.updated}${providerLabel}`);
    } catch {
      setStatus(dictionary.unavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[20px] border border-brown/10 bg-white p-4">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.sourceLanguage}
          </span>
          <select
            value={sourceLocale}
            onChange={(event) => setSourceLocale(event.target.value)}
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          >
            {locales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
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
                    {locale.label}
                  </button>
                );
              })}
          </div>
        </div>
        <label className="inline-flex items-center gap-3 text-sm text-dark">
          <input
            type="checkbox"
            checked={onlyEmptyFields}
            onChange={(event) => setOnlyEmptyFields(event.target.checked)}
            className="h-4 w-4 accent-brown"
          />
          {dictionary.emptyOnly}
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
      {status ? (
        <p className="mt-3 text-sm text-text/75">{status}</p>
      ) : null}
    </div>
  );
}
