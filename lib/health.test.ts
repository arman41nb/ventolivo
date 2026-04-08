import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getApplicationHealth", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.VERCEL_GIT_COMMIT_SHA;
  });

  it("skips the database check when no database URL is configured", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: undefined,
      },
    }));

    const { getApplicationHealth } = await import("./health");
    const result = await getApplicationHealth();

    expect(result.status).toBe("ok");
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "database",
        status: "skipped",
      }),
    );
  });

  it("reports a healthy database when the probe succeeds", async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ ok: 1 }]);

    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: "file:./dev.db",
      },
    }));
    vi.doMock("@/db", () => ({
      prisma: {
        $queryRaw: queryRaw,
      },
    }));

    const { getApplicationHealth } = await import("./health");
    const result = await getApplicationHealth();

    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("ok");
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "database",
        status: "ok",
      }),
    );
  });

  it("marks the application as degraded when the database probe fails", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: "file:./dev.db",
      },
    }));
    vi.doMock("@/db", () => ({
      prisma: {
        $queryRaw: vi.fn().mockRejectedValue(new Error("Database unavailable")),
      },
    }));

    const { getApplicationHealth } = await import("./health");
    const result = await getApplicationHealth();

    expect(result.status).toBe("degraded");
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "database",
        status: "error",
        detail: "Database unavailable",
      }),
    );
  });
});
