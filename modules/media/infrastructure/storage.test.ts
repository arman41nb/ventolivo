import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getMediaStorage", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns the local storage adapter by default", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_PUBLIC_BASE_PATH: "/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
      },
    }));

    const { getMediaStorage } = await import("./storage");
    const adapter = getMediaStorage();

    expect(adapter).toEqual(
      expect.objectContaining({
        store: expect.any(Function),
        remove: expect.any(Function),
      }),
    );
  });

  it("resolves the configured local upload directory", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        MEDIA_STORAGE_DRIVER: "local",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_PUBLIC_BASE_PATH: "/uploads/media",
        MEDIA_S3_ACCESS_KEY_ID: undefined,
        MEDIA_S3_BUCKET: undefined,
        MEDIA_S3_ENDPOINT: undefined,
        MEDIA_S3_FORCE_PATH_STYLE: true,
        MEDIA_S3_KEY_PREFIX: "media",
        MEDIA_S3_PUBLIC_BASE_URL: undefined,
        MEDIA_S3_REGION: "us-east-1",
        MEDIA_S3_SECRET_ACCESS_KEY: undefined,
      },
    }));

    const { resolveLocalMediaUploadDirectory } = await import("./local-media-storage");

    expect(resolveLocalMediaUploadDirectory()).toMatch(/public[\\/]uploads[\\/]media$/);
  });

  it("returns the s3 storage adapter when configured", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        MEDIA_STORAGE_DRIVER: "s3",
        MEDIA_LOCAL_UPLOAD_DIR: "public/uploads/media",
        MEDIA_PUBLIC_BASE_PATH: "/uploads/media",
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

    const { getMediaStorage } = await import("./storage");
    const adapter = getMediaStorage();

    expect(adapter).toEqual(
      expect.objectContaining({
        probe: expect.any(Function),
        remove: expect.any(Function),
        store: expect.any(Function),
      }),
    );
  });
});
