import "server-only";

import { cache } from "react";
import type { MediaLibraryAsset, MediaLibraryAssetInput } from "@/types";
import { getMediaStorage } from "../infrastructure/storage";
import {
  createMediaAssetRecord,
  deleteMediaAssetRecord,
  getAllMediaAssetRecords,
  getMediaAssetRecordsByIds,
  updateMediaAssetRecord,
} from "../infrastructure/prisma-media-repository";
import type { UploadableMediaFile } from "../infrastructure/media-file-helpers";

export const getAllMediaAssets = cache(async (): Promise<MediaLibraryAsset[]> => {
  return getAllMediaAssetRecords();
});

export async function getMediaAssetsByIds(ids: string[]): Promise<MediaLibraryAsset[]> {
  return getMediaAssetRecordsByIds(ids);
}

export async function createMediaAsset(input: MediaLibraryAssetInput): Promise<MediaLibraryAsset> {
  return createMediaAssetRecord(input);
}

export async function updateMediaAsset(
  id: string,
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  return updateMediaAssetRecord(id, input);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  return deleteMediaAssetRecord(id);
}

export async function uploadMediaFiles(
  files: UploadableMediaFile[],
): Promise<MediaLibraryAsset[]> {
  const uploadedAssets: MediaLibraryAsset[] = [];
  const mediaStorage = getMediaStorage();

  for (const file of files) {
    const storedFile = await mediaStorage.store(file);

    try {
      const asset = await createMediaAssetRecord({
        kind: "image",
        url: storedFile.relativePath,
        altText: "",
        label: storedFile.label,
        thumbnailUrl: "",
      });

      uploadedAssets.push(asset);
    } catch (error) {
      await mediaStorage.remove(storedFile.relativePath);
      throw error;
    }
  }

  return uploadedAssets;
}
