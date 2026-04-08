import { describe, expect, it } from "vitest";
import { mapDbProductRecord, normalizeProductTag, parseProductIngredients } from "./mappers";

describe("normalizeProductTag", () => {
  it("normalizes case and surrounding whitespace", () => {
    expect(normalizeProductTag("  DeToX ")).toBe("detox");
  });
});

describe("parseProductIngredients", () => {
  it("returns undefined for malformed json", () => {
    expect(parseProductIngredients("[oops")).toBeUndefined();
  });

  it("returns undefined for non-array payloads", () => {
    expect(parseProductIngredients('{ "name": "olive oil" }')).toBeUndefined();
  });

  it("returns validated ingredient arrays", () => {
    expect(parseProductIngredients('["olive oil", "mint"]')).toEqual(["olive oil", "mint"]);
  });
});

describe("mapDbProductRecord", () => {
  it("maps a database record into the shared product contract", () => {
    expect(
      mapDbProductRecord({
        id: 1,
        name: "Mint Soap",
        slug: "mint-soap",
        tag: "Refreshing",
        price: 120,
        color: "#fff",
        description: "Fresh and clean",
        ingredients: '["mint oil", "olive oil"]',
        weight: "100g",
        featured: true,
        mediaLinks: [],
      }),
    ).toEqual({
      id: 1,
      name: "Mint Soap",
      slug: "mint-soap",
      tag: "Refreshing",
      price: 120,
      color: "#fff",
      description: "Fresh and clean",
      ingredients: ["mint oil", "olive oil"],
      weight: "100g",
      featured: true,
      media: undefined,
    });
  });

  it("drops invalid ingredient payloads instead of throwing", () => {
    expect(
      mapDbProductRecord({
        id: 2,
        name: "Rose Soap",
        slug: "rose-soap",
        tag: "Nourishing",
        price: 150,
        color: "#fdd",
        description: "Soft floral bar",
        ingredients: "[invalid",
        weight: null,
        featured: false,
        mediaLinks: [],
      }),
    ).toEqual({
      id: 2,
      name: "Rose Soap",
      slug: "rose-soap",
      tag: "Nourishing",
      price: 150,
      color: "#fdd",
      description: "Soft floral bar",
      ingredients: undefined,
      weight: undefined,
      featured: false,
      media: undefined,
    });
  });

  it("accepts site asset paths for linked media", () => {
    expect(
      mapDbProductRecord({
        id: 3,
        name: "Olive Soap",
        slug: "olive-soap",
        tag: "Classic",
        price: 180,
        color: "#efe8dd",
        description: "A creamy everyday bar",
        ingredients: null,
        weight: "110g",
        featured: false,
        mediaLinks: [
          {
            role: "cover",
            sortOrder: 0,
            mediaAsset: {
              id: "asset_1",
              kind: "image",
              url: "/uploads/olive-soap-cover.jpg",
              altText: "Olive soap cover",
              thumbnailUrl: "/uploads/olive-soap-cover-thumb.jpg",
              label: "Cover",
            },
          },
        ],
      }),
    ).toEqual({
      id: 3,
      name: "Olive Soap",
      slug: "olive-soap",
      tag: "Classic",
      price: 180,
      color: "#efe8dd",
      description: "A creamy everyday bar",
      ingredients: undefined,
      weight: "110g",
      featured: false,
      media: [
        {
          id: "asset_1",
          assetId: "asset_1",
          type: "image",
          url: "/uploads/olive-soap-cover.jpg",
          alt: "Olive soap cover",
          thumbnailUrl: "/uploads/olive-soap-cover-thumb.jpg",
          label: "Cover",
          role: "cover",
          sortOrder: 0,
        },
      ],
    });
  });

  it("drops malformed linked media instead of throwing", () => {
    expect(
      mapDbProductRecord({
        id: 4,
        name: "Lavender Soap",
        slug: "lavender-soap",
        tag: "Calming",
        price: 200,
        color: "#d9cce3",
        description: "Relaxing floral notes",
        ingredients: null,
        weight: null,
        featured: true,
        mediaLinks: [
          {
            role: "cover",
            sortOrder: 0,
            mediaAsset: {
              id: "asset_bad",
              kind: "image",
              url: "not-a-valid-url",
              altText: "Broken asset",
              thumbnailUrl: null,
              label: null,
            },
          },
        ],
      }),
    ).toEqual({
      id: 4,
      name: "Lavender Soap",
      slug: "lavender-soap",
      tag: "Calming",
      price: 200,
      color: "#d9cce3",
      description: "Relaxing floral notes",
      ingredients: undefined,
      weight: undefined,
      featured: true,
      media: undefined,
    });
  });
});
