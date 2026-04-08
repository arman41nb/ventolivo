import { cache } from "react";
import type { MediaLibraryAsset, MediaLibraryAssetInput } from "@/types";
import {
  createMediaAssetRecord,
  deleteMediaAssetRecord,
  getAllMediaAssetRecords,
  getMediaAssetRecordsByIds,
  updateMediaAssetRecord,
} from "../infrastructure/prisma-media-repository";

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
