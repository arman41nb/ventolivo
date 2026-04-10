import "server-only";

import { env } from "@/lib/env";
import {
  removeStoredMediaFile,
  storeMediaFile,
} from "./local-media-storage";
import type { StoredMediaFile, UploadableMediaFile } from "./media-file-helpers";
import {
  probeS3MediaStorage,
  removeS3StoredMediaFile,
  storeS3MediaFile,
} from "./s3-media-storage";

export interface MediaStorage {
  store(file: UploadableMediaFile): Promise<StoredMediaFile>;
  remove(relativePath: string): Promise<void>;
  probe(): Promise<void>;
}

const localMediaStorage: MediaStorage = {
  store: storeMediaFile,
  remove: removeStoredMediaFile,
  async probe() {
    await storeMediaFileProbe();
  },
};

async function storeMediaFileProbe() {
  const { mkdir } = await import("fs/promises");
  const { resolveLocalMediaUploadDirectory } = await import("./local-media-storage");

  await mkdir(resolveLocalMediaUploadDirectory(), { recursive: true });
}

const s3MediaStorage: MediaStorage = {
  store: storeS3MediaFile,
  remove: removeS3StoredMediaFile,
  probe: probeS3MediaStorage,
};

export function getMediaStorage(): MediaStorage {
  switch (env.MEDIA_STORAGE_DRIVER) {
    case "s3":
      return s3MediaStorage;
    case "local":
    default:
      return localMediaStorage;
  }
}
