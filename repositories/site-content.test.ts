import { beforeEach, describe, expect, it, vi } from "vitest";

describe("site content repository", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.DATABASE_URL;
  });

  it("falls back to defaults when the database is not configured", async () => {
    const [{ getSiteContentRepository }, defaultsModule] = await Promise.all([
      import("./site-content"),
      import("@/modules/site-content/defaults"),
    ]);
    const repository = getSiteContentRepository();

    await expect(repository.getSiteContentSettings()).resolves.toEqual(
      defaultsModule.defaultSiteContentSettings,
    );
    await expect(repository.getSiteLocales()).resolves.toEqual(
      defaultsModule.defaultSiteLocales,
    );
  });

  it("rejects writes when persistence is unavailable", async () => {
    const [{ getSiteContentRepository }, defaultsModule] = await Promise.all([
      import("./site-content"),
      import("@/modules/site-content/defaults"),
    ]);
    const repository = getSiteContentRepository();

    await expect(
      repository.upsertSiteContentSettings({
        ...defaultsModule.defaultSiteContentSettings,
        siteLocales: defaultsModule.defaultSiteLocales,
      }),
    ).rejects.toThrow(
      "Site content updates require DATABASE_URL so changes can be persisted.",
    );
  });
});
