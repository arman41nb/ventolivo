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
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
        NEXT_PUBLIC_SITE_URL: "https://ventolivo.example",
        ADMIN_SESSION_SECRET: undefined,
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
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
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "config",
        status: "ok",
      }),
    );
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "rate-limit",
        status: "ok",
      }),
    );
  });

  it("reports a healthy database when the probe succeeds", async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ ok: 1 }]);

    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: "file:./dev.db",
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
        NEXT_PUBLIC_SITE_URL: "https://ventolivo.example",
        ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
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
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "storage",
        status: "ok",
        detail: expect.stringContaining("driver=local"),
      }),
    );
  });

  it("marks the application as degraded when the database probe fails", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: "file:./dev.db",
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
        NEXT_PUBLIC_SITE_URL: "https://ventolivo.example",
        ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
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

  it("reports degraded config when the admin session secret is too short", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        DATABASE_URL: "file:./dev.db",
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
        NEXT_PUBLIC_SITE_URL: "https://ventolivo.example",
        ADMIN_SESSION_SECRET: "short-secret",
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
      },
    }));
    vi.doMock("@/db", () => ({
      prisma: {
        $queryRaw: vi.fn().mockResolvedValue([{ ok: 1 }]),
      },
    }));

    const { getApplicationHealth } = await import("./health");
    const result = await getApplicationHealth();

    expect(result.status).toBe("degraded");
    expect(result.checks).toContainEqual(
      expect.objectContaining({
        name: "config",
        status: "error",
      }),
    );
  });
});
