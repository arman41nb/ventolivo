import { env } from "@/lib/env";
import { isValidLocale, type Locale } from "@/i18n/config";

interface TranslationFields extends Record<string, string> {
  name: string;
  tag: string;
  description: string;
}

type TranslationResult = Partial<Record<Locale, TranslationFields>>;
type TranslationProviders = Partial<
  Record<Locale, "libretranslate" | "mymemory">
>;

type TranslationProvider = "libretranslate" | "mymemory";

interface LibreTranslateResponse {
  translatedText?: string | string[];
  error?: string;
}

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
}

function getLibreTranslateUrl(): string {
  if (!env.LIBRETRANSLATE_URL) {
    throw new Error("LIBRETRANSLATE_URL is not configured");
  }

  return env.LIBRETRANSLATE_URL.replace(/\/$/, "");
}

async function translateTexts(
  texts: string[],
  source: Locale,
  target: Locale,
): Promise<string[]> {
  const normalizedTexts = texts.map((text) => text.trim());

  if (source === target) {
    return texts;
  }

  const response = await fetch(`${getLibreTranslateUrl()}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: normalizedTexts,
      source,
      target,
      format: "text",
      api_key: env.LIBRETRANSLATE_API_KEY || undefined,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `LibreTranslate request failed with status ${response.status} at ${getLibreTranslateUrl()}`,
    );
  }

  const result = (await response.json()) as LibreTranslateResponse;

  if (!result.translatedText) {
    throw new Error(
      result.error ||
        `LibreTranslate returned no translated text from ${getLibreTranslateUrl()}`,
    );
  }

  if (Array.isArray(result.translatedText)) {
    return result.translatedText;
  }

  return [result.translatedText];
}

async function translateTextsWithMyMemory(
  texts: string[],
  source: Locale,
  target: Locale,
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(async (text) => {
      if (!text.trim() || source === target) {
        return text;
      }

      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", text);
      url.searchParams.set("langpair", `${source}|${target}`);

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`MyMemory request failed with status ${response.status}`);
      }

      const result = (await response.json()) as MyMemoryResponse;
      return result.responseData?.translatedText || text;
    }),
  );

  return translations;
}

export async function autoTranslateProductFields({
  sourceLocale,
  targetLocales,
  fields,
}: {
  sourceLocale: Locale;
  targetLocales: Locale[];
  fields: TranslationFields;
}): Promise<{
  translations: TranslationResult;
  providers: TranslationProviders;
}> {
  const { translations, providers } = await autoTranslateTextFields({
    sourceLocale,
    targetLocales,
    fields,
  });

  return {
    translations: translations as TranslationResult,
    providers: providers as TranslationProviders,
  };
}

export async function autoTranslateTextFields<
  TFields extends Record<string, string>,
>({
  sourceLocale,
  targetLocales,
  fields,
}: {
  sourceLocale: Locale;
  targetLocales: Locale[];
  fields: TFields;
}): Promise<{
  translations: Partial<Record<Locale, TFields>>;
  providers: Partial<Record<Locale, TranslationProvider>>;
}> {
  const fieldEntries = Object.entries(fields) as Array<[keyof TFields, string]>;
  const validTargets = targetLocales.filter(
    (locale): locale is Locale => isValidLocale(locale) && locale !== sourceLocale,
  );
  const fallbackLocales: Locale[] = [];

  const translations = await Promise.all(
    validTargets.map(async (targetLocale) => {
      let translatedTexts: string[];
      let provider: TranslationProvider = "libretranslate";

      try {
        translatedTexts = await translateTexts(
          fieldEntries.map(([, value]) => value),
          sourceLocale,
          targetLocale,
        );
      } catch {
        provider = "mymemory";
        fallbackLocales.push(targetLocale);
        translatedTexts = await translateTextsWithMyMemory(
          fieldEntries.map(([, value]) => value),
          sourceLocale,
          targetLocale,
        );
      }

      const translatedRecord = Object.fromEntries(
        fieldEntries.map(([key], index) => [key, translatedTexts[index] ?? fields[key]]),
      ) as TFields;

      return [
        targetLocale,
        [translatedRecord, provider],
      ] as const;
    }),
  );

  if (process.env.NODE_ENV !== "production" && fallbackLocales.length > 0) {
    console.warn(
      `LibreTranslate fell back to MyMemory for ${sourceLocale}->${fallbackLocales.join(", ")}.`,
    );
  }

  return {
    translations: Object.fromEntries(
      translations.map(([locale, [translation]]) => [locale, translation]),
    ),
    providers: Object.fromEntries(
      translations.map(([locale, [, provider]]) => [locale, provider]),
    ),
  };
}
