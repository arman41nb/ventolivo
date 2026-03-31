import { describe, expect, it } from "vitest";
import {
  mapDbProductRecord,
  normalizeProductTag,
  parseProductIngredients,
} from "./mappers";

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
    expect(parseProductIngredients('["olive oil", "mint"]')).toEqual([
      "olive oil",
      "mint",
    ]);
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
    });
  });
});
