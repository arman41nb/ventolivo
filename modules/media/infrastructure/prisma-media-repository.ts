import type { MediaLibraryAsset, MediaLibraryAssetInput } from "@/types";

export async function getAllMediaAssetRecords(): Promise<MediaLibraryAsset[]> {
  const { dbGetAllMediaAssets } = await import("@/db");
  return dbGetAllMediaAssets();
}

export async function getMediaAssetRecordsByIds(ids: string[]): Promise<MediaLibraryAsset[]> {
  const { dbGetMediaAssetsByIds } = await import("@/db");
  return dbGetMediaAssetsByIds(ids);
}

export async function createMediaAssetRecord(
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  const { dbCreateMediaAsset } = await import("@/db");
  return dbCreateMediaAsset(input);
}

export async function updateMediaAssetRecord(
  id: string,
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  const { dbUpdateMediaAsset } = await import("@/db");
  return dbUpdateMediaAsset(id, input);
}

export async function deleteMediaAssetRecord(id: string): Promise<void> {
  const { dbDeleteMediaAsset } = await import("@/db");
  return dbDeleteMediaAsset(id);
}
