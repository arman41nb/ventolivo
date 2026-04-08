import { describe, expect, it } from "vitest";
import en from "./dictionaries/en.json";
import tr from "./dictionaries/tr.json";
import { getDictionary } from "./get-dictionary";

describe("getDictionary", () => {
  it("uses the base locale dictionary for regional variants", async () => {
    const dictionary = await getDictionary("tr-TR");

    expect(dictionary.navbar.links.products).toBe(tr.navbar.links.products);
    expect(dictionary.admin.title).toBe(tr.admin.title);
  });

  it("falls back to English when no locale dictionary exists", async () => {
    const dictionary = await getDictionary("es");

    expect(dictionary.navbar.links.products).toBe(en.navbar.links.products);
    expect(dictionary.seo.description).toBe(en.seo.description);
  });
});
