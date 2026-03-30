import { describe, it, expect } from "vitest";
import { cn, formatPrice, slugify, buildWhatsAppLink, buildProductWhatsAppMessage } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("formatPrice", () => {
  it("formats price with currency symbol", () => {
    expect(formatPrice(180)).toBe("₺180");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Activated Charcoal")).toBe("activated-charcoal");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });
});

describe("buildWhatsAppLink", () => {
  it("creates WhatsApp link with encoded message", () => {
    const link = buildWhatsAppLink("Hello World");
    expect(link).toContain("https://wa.me/");
    expect(link).toContain("Hello%20World");
  });
});

describe("buildProductWhatsAppMessage", () => {
  it("creates order message with product name and price", () => {
    const msg = buildProductWhatsAppMessage("Test Soap", 100);
    expect(msg).toContain("Test Soap");
    expect(msg).toContain("₺100");
  });
});
