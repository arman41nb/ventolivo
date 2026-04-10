import { beforeEach, describe, expect, it, vi } from "vitest";

describe("s3 media storage helpers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("builds public URLs from the configured base URL", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        MEDIA_S3_ACCESS_KEY_ID: "access",
        MEDIA_S3_BUCKET: "ventolivo-media",
        MEDIA_S3_ENDPOINT: "https://s3.example.com",
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: "https://cdn.example.com/assets",
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: "secret",
      },
    }));

    const { resolveS3PublicUrl } = await import("./s3-media-storage");

    expect(resolveS3PublicUrl("media/example.png")).toBe(
      "https://cdn.example.com/assets/media/example.png",
    );
  });

  it("extracts object keys from public URLs", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        MEDIA_S3_ACCESS_KEY_ID: "access",
        MEDIA_S3_BUCKET: "ventolivo-media",
        MEDIA_S3_ENDPOINT: "https://s3.example.com",
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: "https://cdn.example.com/assets",
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: "secret",
      },
    }));

    const { getS3ObjectKeyFromUrl } = await import("./s3-media-storage");

    expect(getS3ObjectKeyFromUrl("https://cdn.example.com/assets/media/example.png")).toBe(
      "media/example.png",
    );
  });
});
