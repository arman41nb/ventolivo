import { cache } from "react";
import {
  dbCreateMediaAsset,
  dbDeleteMediaAsset,
  dbGetAllMediaAssets,
  dbGetMediaAssetsByIds,
  dbUpdateMediaAsset,
} from "@/db";
import type { MediaLibraryAsset, MediaLibraryAssetInput } from "@/types";

export const getAllMediaAssets = cache(async (): Promise<MediaLibraryAsset[]> => {
  return dbGetAllMediaAssets();
});

export async function getMediaAssetsByIds(ids: string[]): Promise<MediaLibraryAsset[]> {
  return dbGetMediaAssetsByIds(ids);
}

export async function createMediaAsset(
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  return dbCreateMediaAsset(input);
}

export async function updateMediaAsset(
  id: string,
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  return dbUpdateMediaAsset(id, input);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  return dbDeleteMediaAsset(id);
}
