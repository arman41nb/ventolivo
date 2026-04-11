import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductTranslationAssistant from "./ProductTranslationAssistant";

const dictionary = {
  targetLocales: "targets",
  emptyOnly: "Empty only",
  overwriteAllowed: "Overwrite allowed",
  sourceLanguage: "Source language",
  targetLanguages: "Target languages",
  translating: "Translating",
  translateButton: "Translate",
  fillBaseFields: "Fill base fields",
  selectTargetLanguage: "Select a target language",
  updated: "Updated",
  providerPrefix: "Provider",
  unavailable: "Unavailable",
} as const;

describe("ProductTranslationAssistant", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults the source locale to the product base locale instead of the admin UI locale", () => {
    render(
      <ProductTranslationAssistant
        currentLocale="fa"
        locales={[
          { code: "en", label: "English", direction: "ltr" },
          { code: "fa", label: "Persian", direction: "rtl" },
          { code: "tr", label: "Turkish", direction: "ltr" },
        ]}
        dictionary={dictionary as never}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("en");
    expect(screen.getByRole("button", { name: /Persian/i })).toBeInTheDocument();
  });

  it("shows the server rate-limit message when translation providers are throttled", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "Translation providers are rate-limited right now. Please wait a minute and try again.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "retry-after": "60",
            },
          },
        ),
      ),
    );

    const { container } = render(
      <form>
        <input name="name" defaultValue="Soap" />
        <input name="tag" defaultValue="Care" />
        <textarea name="description" defaultValue="Natural soap" />
        <input name="weight" defaultValue="" />
        <input name="ingredients" defaultValue="" />
        <input name="translations.name.fa" defaultValue="" />
        <ProductTranslationAssistant
          currentLocale="fa"
          locales={[
            { code: "en", label: "English", direction: "ltr" },
            { code: "fa", label: "Persian", direction: "rtl" },
          ]}
          dictionary={dictionary as never}
        />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Translate" }));

    await waitFor(() => {
      expect(container).toHaveTextContent(
        "Translation providers are rate-limited right now. Please wait a minute and try again. Retry after 60 seconds.",
      );
    });
  });

  it("stages translated product fields in hidden JSON using the same pattern as site content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            translations: {
              fa: {
                name: "صابون",
                tag: "مراقبت",
                description: "صابون طبیعی",
                weight: "",
                ingredients: "",
              },
            },
            providers: {
              fa: "mymemory",
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    const { container } = render(
      <form>
        <input name="name" defaultValue="Soap" />
        <input name="tag" defaultValue="Care" />
        <textarea name="description" defaultValue="Natural soap" />
        <input name="weight" defaultValue="" />
        <input name="ingredients" defaultValue="" />
        <input name="translations.name.fa" defaultValue="" />
        <ProductTranslationAssistant
          currentLocale="fa"
          locales={[
            { code: "en", label: "English", direction: "ltr" },
            { code: "fa", label: "Persian", direction: "rtl" },
          ]}
          dictionary={dictionary as never}
        />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Translate" }));

    await waitFor(() => {
      const stagedInput = container.querySelector(
        '[name="translatedProductJson"]',
      ) as HTMLInputElement | null;

      expect(stagedInput).not.toBeNull();
      expect(stagedInput?.value).toContain('"fa"');
      expect(stagedInput?.value).toContain("صابون");
    });
  });
});
