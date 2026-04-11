import { beforeEach, describe, expect, it, vi } from "vitest";

describe("rate limiting", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("allows requests until the configured translation limit is reached", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX_ADMIN_AUTH_ATTEMPTS: 2,
        RATE_LIMIT_MAX_MEDIA_UPLOADS: 2,
        RATE_LIMIT_MAX_TRANSLATION_REQUESTS: 2,
      },
    }));

    const { enforceTranslationRateLimit, resetRateLimitBuckets } = await import("./rate-limit");
    resetRateLimitBuckets();

    await expect(enforceTranslationRateLimit("admin")).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
    });
    await expect(enforceTranslationRateLimit("admin")).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(enforceTranslationRateLimit("admin")).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it("tracks upload limits independently from translation limits", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX_ADMIN_AUTH_ATTEMPTS: 2,
        RATE_LIMIT_MAX_MEDIA_UPLOADS: 1,
        RATE_LIMIT_MAX_TRANSLATION_REQUESTS: 3,
      },
    }));

    const {
      enforceMediaUploadRateLimit,
      enforceTranslationRateLimit,
      resetRateLimitBuckets,
    } = await import("./rate-limit");
    resetRateLimitBuckets();

    await expect(enforceMediaUploadRateLimit("ip-1")).resolves.toMatchObject({
      allowed: true,
    });
    await expect(enforceMediaUploadRateLimit("ip-1")).resolves.toMatchObject({
      allowed: false,
    });
    await expect(enforceTranslationRateLimit("ip-1")).resolves.toMatchObject({
      allowed: true,
    });
  });

  it("limits admin authentication separately from other scopes", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        RATE_LIMIT_DRIVER: "memory",
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX_ADMIN_AUTH_ATTEMPTS: 2,
        RATE_LIMIT_MAX_MEDIA_UPLOADS: 1,
        RATE_LIMIT_MAX_TRANSLATION_REQUESTS: 3,
      },
    }));

    const {
      enforceAdminAuthRateLimit,
      enforceTranslationRateLimit,
      resetRateLimitBuckets,
    } = await import("./rate-limit");
    resetRateLimitBuckets();

    await expect(enforceAdminAuthRateLimit("auth-1")).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
    });
    await expect(enforceAdminAuthRateLimit("auth-1")).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(enforceAdminAuthRateLimit("auth-1")).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
    });
    await expect(enforceTranslationRateLimit("auth-1")).resolves.toMatchObject({
      allowed: true,
    });
  });
});
