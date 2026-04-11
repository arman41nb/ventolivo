import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductEditorWorkspace from "./ProductEditorWorkspace";

const dictionary = {
  admin: {
    form: {
      name: "Name",
      slug: "Slug",
      tag: "Tag",
      price: "Price",
      color: "Color",
      weight: "Weight",
      ingredients: "Ingredients",
      ingredientsPlaceholder: "Wax, oil",
      description: "Description",
      featured: "Featured",
    },
    inventory: {
      translationsTitle: "Translations",
    },
    translationAssistant: {
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
    },
    productEditor: {
      workspaceBadge: "Workspace",
      workspaceTitle: "Workspace title",
      libraryImages: "images",
      libraryVideos: "videos",
      activeLocales: "locales",
      tabs: {
        library: "Library",
        manual: "Manual",
        translations: "Translations",
      },
      libraryCoverTitle: "Cover",
      libraryCoverDescription: "Cover description",
      noLibraryCover: "No cover",
      noLibraryCoverDescription: "No cover description",
      libraryGalleryTitle: "Gallery",
      libraryGalleryDescription: "Gallery description",
      libraryVideoTitle: "Video",
      libraryVideoDescription: "Video description",
      noLibraryVideo: "No video",
      noLibraryVideoDescription: "No video description",
      manualMediaTitle: "Manual media",
      manualMediaDescription: "Manual media description",
      coverImageUrl: "Cover URL",
      coverImageAlt: "Cover alt",
      videoUrl: "Video URL",
      videoThumbnailUrl: "Video thumbnail URL",
      galleryImages: "Gallery images",
      galleryImagesPlaceholder: "https://example.com/image.jpg | Alt",
      translationsTitle: "Translations workspace",
      translationsDescription: "Translations description",
      localeEditors: "locale editors",
      localesWithSavedData: "locales saved",
      hasContent: "Has content",
      empty: "Empty",
      currentEditorLocale: "Current locale",
      currentEditorLocaleDescription: "Current locale description",
    },
  },
} as const;

describe("ProductEditorWorkspace", () => {
  it("keeps translation fields mounted when switching tabs", () => {
    const { container } = render(
      <ProductEditorWorkspace
        locale="en"
        dictionary={dictionary as never}
        submitLabel="Save"
        action={async () => {}}
        supportedLocales={[
          { code: "en", label: "English", direction: "ltr" },
          { code: "tr", label: "Turkish", direction: "ltr" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Translations" }));

    const translatedNameInput = container.querySelector(
      '[name="translations.name.tr"]',
    ) as HTMLInputElement | null;

    expect(translatedNameInput).not.toBeNull();

    fireEvent.change(translatedNameInput!, { target: { value: "Mum" } });

    fireEvent.click(screen.getByRole("button", { name: "Library" }));

    expect(screen.getByDisplayValue("Mum")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mum")).toHaveAttribute("name", "translations.name.tr");
  });
});
