import { beforeEach, describe, expect, it, vi } from "vitest";

describe("autoTranslateTextFields", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns successful locale translations even when another locale exhausts both providers", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        LIBRETRANSLATE_URL: "https://libretranslate.example",
        LIBRETRANSLATE_API_KEY: undefined,
      },
    }));

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("libretranslate.example")) {
        return new Response(null, { status: 503 });
      }

      if (url.includes("translate.googleapis.com")) {
        const parsedUrl = new URL(url);
        const text = parsedUrl.searchParams.get("q");
        const target = parsedUrl.searchParams.get("tl");

        if (target === "tr") {
          return Response.json({
            sentences: [{ trans: `tr:${text}` }],
          });
        }

        return new Response(null, { status: 503 });
      }

      const parsedUrl = new URL(url);
      const langpair = parsedUrl.searchParams.get("langpair");

      if (langpair === "en|fa") {
        return new Response(null, { status: 429 });
      }

      return new Response(null, { status: 500 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const { autoTranslateTextFields } = await import("./libretranslate");
    const result = await autoTranslateTextFields({
      sourceLocale: "en",
      targetLocales: ["tr", "fa"],
      fields: {
        name: "Soap",
        tag: "Care",
      },
    });

    expect(result.translations).toEqual({
      tr: {
        name: "tr:Soap",
        tag: "tr:Care",
      },
    });
    expect(result.providers).toEqual({
      tr: "google",
    });
  });

  it("uses Google Translate before MyMemory when LibreTranslate is unavailable", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        LIBRETRANSLATE_URL: "https://libretranslate.example",
        LIBRETRANSLATE_API_KEY: undefined,
      },
    }));

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("libretranslate.example")) {
        return new Response(null, { status: 503 });
      }

      if (url.includes("translate.googleapis.com")) {
        const parsedUrl = new URL(url);
        const text = parsedUrl.searchParams.get("q");

        return Response.json({
          sentences: [{ trans: `fa:${text}` }],
        });
      }

      return new Response(null, { status: 500 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const { autoTranslateTextFields } = await import("./libretranslate");
    const result = await autoTranslateTextFields({
      sourceLocale: "en",
      targetLocales: ["fa"],
      fields: {
        name: "Soap",
      },
    });

    expect(result.translations).toEqual({
      fa: {
        name: "fa:Soap",
      },
    });
    expect(result.providers).toEqual({
      fa: "google",
    });
  });

  it("throws a rate-limit error when every provider is exhausted by 429 responses", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        LIBRETRANSLATE_URL: "https://libretranslate.example",
        LIBRETRANSLATE_API_KEY: undefined,
      },
    }));

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("libretranslate.example")) {
        return new Response(null, { status: 429 });
      }

      if (url.includes("translate.googleapis.com")) {
        return new Response(null, { status: 429 });
      }

      return new Response(null, { status: 429 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const { autoTranslateTextFields, TranslationServiceError } = await import("./libretranslate");

    await expect(
      autoTranslateTextFields({
        sourceLocale: "en",
        targetLocales: ["fa"],
        fields: {
          name: "Soap",
        },
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<InstanceType<typeof TranslationServiceError>>>({
        statusCode: 429,
        message: expect.stringContaining("MyMemory free translation quota is exhausted"),
      }),
    );
  });

  it("retries MyMemory 429 responses before failing over permanently", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        LIBRETRANSLATE_URL: "https://libretranslate.example",
        LIBRETRANSLATE_API_KEY: undefined,
      },
    }));

    let myMemoryAttempts = 0;
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("libretranslate.example")) {
        return new Response(null, { status: 503 });
      }

      if (url.includes("translate.googleapis.com")) {
        return new Response(null, { status: 503 });
      }

      myMemoryAttempts += 1;

      if (myMemoryAttempts === 1) {
        return new Response(null, { status: 429 });
      }

      return Response.json({
        responseData: {
          translatedText: "fa:Soap",
        },
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const { autoTranslateTextFields } = await import("./libretranslate");
    const result = await autoTranslateTextFields({
      sourceLocale: "en",
      targetLocales: ["fa"],
      fields: {
        name: "Soap",
      },
    });

    expect(myMemoryAttempts).toBe(2);
    expect(result.translations).toEqual({
      fa: {
        name: "fa:Soap",
      },
    });
    expect(result.providers).toEqual({
      fa: "mymemory",
    });
  });

  it("reports a configuration error when LibreTranslate needs an API key and MyMemory quota is exhausted", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        LIBRETRANSLATE_URL: "https://libretranslate.example",
        LIBRETRANSLATE_API_KEY: undefined,
      },
    }));

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("libretranslate.example")) {
        return new Response(
          JSON.stringify({
            error: "Visit https://portal.libretranslate.com to get an API key",
          }),
          { status: 400 },
        );
      }

      if (url.includes("translate.googleapis.com")) {
        return new Response(null, { status: 503 });
      }

      return new Response(
        JSON.stringify({
          responseData: {
            translatedText:
              "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY. NEXT AVAILABLE IN 07 HOURS.",
          },
          responseDetails:
            "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY. NEXT AVAILABLE IN 07 HOURS.",
        }),
        { status: 429 },
      );
    });

    vi.stubGlobal("fetch", fetchMock);

    const { autoTranslateTextFields, TranslationServiceError } = await import("./libretranslate");

    await expect(
      autoTranslateTextFields({
        sourceLocale: "en",
        targetLocales: ["fa"],
        fields: {
          name: "Soap",
        },
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<InstanceType<typeof TranslationServiceError>>>({
        statusCode: 503,
        message: expect.stringContaining("requires a valid API key"),
      }),
    );
  });
});
