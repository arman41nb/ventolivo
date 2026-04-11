import { env } from "@/lib/env";
import { isValidLocale, type Locale } from "@/i18n/config";

interface TranslationFields extends Record<string, string> {
  name: string;
  tag: string;
  description: string;
  weight: string;
  ingredients: string;
}

type TranslationResult = Partial<Record<Locale, TranslationFields>>;
type TranslationProvider = "libretranslate" | "google" | "mymemory";
type TranslationProviders = Partial<Record<Locale, TranslationProvider>>;

class TranslationRequestError extends Error {
  constructor(
    message: string,
    readonly provider: TranslationProvider,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = "TranslationRequestError";
  }
}

export class TranslationServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "TranslationServiceError";
  }
}

interface LibreTranslateResponse {
  translatedText?: string | string[];
  error?: string;
}

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
  responseDetails?: string;
}

interface GoogleTranslateStructuredResponse {
  sentences?: Array<{
    trans?: string;
  }>;
  error?: string | { message?: string };
}

type GoogleTranslateResponse = GoogleTranslateStructuredResponse | Array<unknown>;
type TranslationFunction = (texts: string[], source: Locale, target: Locale) => Promise<string[]>;

const myMemoryRetryDelaysMs = process.env.NODE_ENV === "test" ? [1, 1] : [400, 1200];
const translationProviderChain: Array<{
  provider: TranslationProvider;
  translate: TranslationFunction;
}> = [
  { provider: "libretranslate", translate: translateTextsWithLibreTranslate },
  { provider: "google", translate: translateTextsWithGoogle },
  { provider: "mymemory", translate: translateTextsWithMyMemory },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLibreTranslateUrl(): string {
  if (!env.LIBRETRANSLATE_URL) {
    throw new TranslationRequestError(
      "LibreTranslate is not configured. Set LIBRETRANSLATE_URL to a working instance.",
      "libretranslate",
    );
  }

  return env.LIBRETRANSLATE_URL.replace(/\/$/, "");
}

async function readProviderErrorDetail(response: Response): Promise<string | undefined> {
  const body = await response.text();

  if (!body.trim()) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(body) as {
      error?: string;
      responseDetails?: string;
      responseData?: { translatedText?: string };
    };

    return (
      parsed.error ||
      parsed.responseDetails ||
      parsed.responseData?.translatedText ||
      body.slice(0, 280)
    );
  } catch {
    return body.slice(0, 280);
  }
}

function isMyMemoryQuotaExceeded(error: TranslationRequestError) {
  return (
    error.provider === "mymemory" &&
    (error.statusCode === 429 ||
      /all available free translations|quota|next available/i.test(error.message))
  );
}

function isRateLimitedTranslationError(error: TranslationRequestError) {
  return error.statusCode === 429 || isMyMemoryQuotaExceeded(error);
}

function normalizeTranslationRequestError(
  provider: TranslationProvider,
  error: unknown,
): TranslationRequestError {
  if (error instanceof TranslationRequestError) {
    return error;
  }

  return new TranslationRequestError(
    error instanceof Error ? error.message : `${provider} translation request failed`,
    provider,
  );
}

function buildTranslationFailureMessage(errors: TranslationRequestError[]) {
  const libreTranslateNeedsKey = errors.some(
    (error) =>
      error.provider === "libretranslate" &&
      /api key|portal\.libretranslate\.com/i.test(error.message),
  );
  const libreTranslateUnconfigured = errors.some(
    (error) =>
      error.provider === "libretranslate" && /libretranslate is not configured/i.test(error.message),
  );
  const googleUnavailable = errors.some((error) => error.provider === "google");
  const myMemoryQuotaExceeded = errors.some((error) => isMyMemoryQuotaExceeded(error));

  if (libreTranslateNeedsKey && googleUnavailable && myMemoryQuotaExceeded) {
    return "Configured LibreTranslate endpoint requires a valid API key, Google Translate fallback is unavailable, and MyMemory free quota is exhausted. Update LIBRETRANSLATE_API_KEY or LIBRETRANSLATE_URL, or try again shortly.";
  }

  if (libreTranslateUnconfigured && googleUnavailable && myMemoryQuotaExceeded) {
    return "LibreTranslate is not configured, Google Translate fallback is unavailable, and MyMemory free quota is exhausted. Set LIBRETRANSLATE_URL to a working instance or try again shortly.";
  }

  if (libreTranslateNeedsKey && myMemoryQuotaExceeded) {
    return "Configured LibreTranslate endpoint requires a valid API key, and MyMemory free quota is exhausted. Update LIBRETRANSLATE_API_KEY or LIBRETRANSLATE_URL, or wait for the MyMemory quota reset.";
  }

  if (libreTranslateNeedsKey) {
    return "Configured LibreTranslate endpoint requires a valid API key. Update LIBRETRANSLATE_API_KEY or point LIBRETRANSLATE_URL to a working instance.";
  }

  if (myMemoryQuotaExceeded) {
    return "MyMemory free translation quota is exhausted right now. Wait for the quota reset or switch to a working LibreTranslate instance.";
  }

  if (libreTranslateUnconfigured && googleUnavailable) {
    return "LibreTranslate is not configured, and Google Translate fallback is currently unavailable. Set LIBRETRANSLATE_URL to a working instance or try again shortly.";
  }

  const uniqueMessages = Array.from(new Set(errors.map((error) => error.message)));
  return uniqueMessages[0] || "Translation providers are currently unavailable. Please try again shortly.";
}

async function translateTextsWithLibreTranslate(
  texts: string[],
  source: Locale,
  target: Locale,
): Promise<string[]> {
  const normalizedTexts = texts.map((text) => text.trim());

  if (source === target) {
    return texts;
  }

  const libreTranslateUrl = getLibreTranslateUrl();
  const response = await fetch(`${libreTranslateUrl}/translate`, {
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
    const detail = await readProviderErrorDetail(response);
    throw new TranslationRequestError(
      detail
        ? `LibreTranslate request failed with status ${response.status}: ${detail}`
        : `LibreTranslate request failed with status ${response.status} at ${libreTranslateUrl}`,
      "libretranslate",
      response.status,
    );
  }

  const result = (await response.json()) as LibreTranslateResponse;

  if (!result.translatedText) {
    throw new TranslationRequestError(
      result.error || `LibreTranslate returned no translated text from ${libreTranslateUrl}`,
      "libretranslate",
    );
  }

  if (Array.isArray(result.translatedText)) {
    return result.translatedText;
  }

  return [result.translatedText];
}

function extractGoogleTranslatedText(result: GoogleTranslateResponse): string | undefined {
  if (Array.isArray(result)) {
    const [segments] = result;

    if (!Array.isArray(segments)) {
      return undefined;
    }

    return segments
      .map((segment) =>
        Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : "",
      )
      .join("");
  }

  if (!Array.isArray(result.sentences)) {
    return undefined;
  }

  return result.sentences.map((sentence) => sentence.trans ?? "").join("");
}

async function translateTextsWithGoogle(
  texts: string[],
  source: Locale,
  target: Locale,
): Promise<string[]> {
  const translations: string[] = [];

  for (const text of texts) {
    if (!text.trim() || source === target) {
      translations.push(text);
      continue;
    }

    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", source);
    url.searchParams.set("tl", target);
    url.searchParams.set("dt", "t");
    url.searchParams.set("dj", "1");
    url.searchParams.set("q", text);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const detail = await readProviderErrorDetail(response);
      throw new TranslationRequestError(
        detail
          ? `Google Translate request failed with status ${response.status}: ${detail}`
          : `Google Translate request failed with status ${response.status}`,
        "google",
        response.status,
      );
    }

    const result = (await response.json()) as GoogleTranslateResponse;
    const translatedText = extractGoogleTranslatedText(result);

    if (!translatedText?.trim()) {
      const detail =
        !Array.isArray(result) && result.error
          ? typeof result.error === "string"
            ? result.error
            : result.error.message
          : undefined;

      throw new TranslationRequestError(
        detail || `Google Translate returned no translated text for ${source}->${target}`,
        "google",
      );
    }

    translations.push(translatedText);
  }

  return translations;
}

async function translateTextsWithMyMemory(
  texts: string[],
  source: Locale,
  target: Locale,
): Promise<string[]> {
  const translations: string[] = [];

  for (const text of texts) {
    if (!text.trim() || source === target) {
      translations.push(text);
      continue;
    }

    let lastStatusCode: number | undefined;
    let translated = false;

    for (let attempt = 0; attempt <= myMemoryRetryDelaysMs.length; attempt += 1) {
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", text);
      url.searchParams.set("langpair", `${source}|${target}`);

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (response.ok) {
        const result = (await response.json()) as MyMemoryResponse;
        translations.push(result.responseData?.translatedText || text);
        translated = true;
        break;
      }

      lastStatusCode = response.status;

      if (response.status === 429 && attempt < myMemoryRetryDelaysMs.length) {
        await wait(myMemoryRetryDelaysMs[attempt]);
        continue;
      }

      const detail = await readProviderErrorDetail(response);
      throw new TranslationRequestError(
        detail
          ? `MyMemory request failed with status ${response.status}: ${detail}`
          : `MyMemory request failed with status ${response.status}`,
        "mymemory",
        response.status,
      );
    }

    if (!translated) {
      throw new TranslationRequestError(
        `MyMemory request failed with status ${lastStatusCode ?? 500}`,
        "mymemory",
        lastStatusCode,
      );
    }
  }

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

export async function autoTranslateTextFields<TFields extends Record<string, string>>({
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
  const fallbackLocales: Array<readonly [Locale, TranslationProvider]> = [];
  const failedLocales: Locale[] = [];
  const rateLimitedLocales: Locale[] = [];
  const providerErrors: TranslationRequestError[] = [];

  const translations: Array<readonly [Locale, readonly [TFields, TranslationProvider]]> = [];
  const sourceTexts = fieldEntries.map(([, value]) => value);

  for (const targetLocale of validTargets) {
    let translatedTexts: string[] | null = null;
    let provider: TranslationProvider | null = null;
    const localeErrors: TranslationRequestError[] = [];

    for (const candidate of translationProviderChain) {
      try {
        translatedTexts = await candidate.translate(sourceTexts, sourceLocale, targetLocale);
        provider = candidate.provider;
        break;
      } catch (error) {
        const normalizedError = normalizeTranslationRequestError(candidate.provider, error);
        providerErrors.push(normalizedError);
        localeErrors.push(normalizedError);
      }
    }

    if (!translatedTexts || !provider) {
      failedLocales.push(targetLocale);

      if (localeErrors.length > 0 && localeErrors.every(isRateLimitedTranslationError)) {
        rateLimitedLocales.push(targetLocale);
      }

      continue;
    }

    if (provider !== "libretranslate") {
      fallbackLocales.push([targetLocale, provider] as const);
    }

    const translatedRecord = Object.fromEntries(
      fieldEntries.map(([key], index) => [key, translatedTexts[index] ?? fields[key]]),
    ) as TFields;

    translations.push([targetLocale, [translatedRecord, provider]] as const);
  }

  if (process.env.NODE_ENV !== "production" && fallbackLocales.length > 0) {
    console.warn(
      `LibreTranslate fell back for ${sourceLocale}->${fallbackLocales
        .map(([locale, provider]) => `${locale} via ${provider}`)
        .join(", ")}.`,
    );
  }

  if (process.env.NODE_ENV !== "production" && failedLocales.length > 0) {
    console.warn(
      `Translation failed for ${sourceLocale}->${failedLocales.join(", ")} after exhausting providers.`,
    );
  }

  if (translations.length === 0 && validTargets.length > 0) {
    const failureMessage = buildTranslationFailureMessage(providerErrors);

    if (
      providerErrors.some((error) => /api key|portal\.libretranslate\.com/i.test(error.message))
    ) {
      throw new TranslationServiceError(failureMessage, 503);
    }

    if (rateLimitedLocales.length === validTargets.length) {
      throw new TranslationServiceError(failureMessage, 429);
    }

    throw new TranslationServiceError(failureMessage, 503);
  }

  return {
    translations: Object.fromEntries(
      translations.map(([locale, [translation]]) => [locale, translation]),
    ),
    providers: Object.fromEntries(translations.map(([locale, [, provider]]) => [locale, provider])),
  };
}
