import { prisma } from "./client";
import type { MediaLibraryAsset, MediaLibraryAssetInput } from "@/types";

function mapMediaAsset(record: {
  id: string;
  kind: string;
  url: string;
  altText: string | null;
  thumbnailUrl: string | null;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MediaLibraryAsset {
  return {
    id: record.id,
    kind: record.kind === "video" ? "video" : "image",
    url: record.url,
    altText: record.altText ?? undefined,
    thumbnailUrl: record.thumbnailUrl ?? undefined,
    label: record.label ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function dbGetAllMediaAssets(): Promise<MediaLibraryAsset[]> {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return assets.map(mapMediaAsset);
}

export async function dbGetMediaAssetsByIds(ids: string[]): Promise<MediaLibraryAsset[]> {
  if (ids.length === 0) {
    return [];
  }

  const assets = await prisma.mediaAsset.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return assets.map(mapMediaAsset);
}

export async function dbCreateMediaAsset(
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  const asset = await prisma.mediaAsset.create({
    data: {
      kind: input.kind,
      url: input.url,
      altText: input.altText ?? null,
      thumbnailUrl: input.thumbnailUrl ?? null,
      label: input.label ?? null,
    },
  });

  return mapMediaAsset(asset);
}

export async function dbUpdateMediaAsset(
  id: string,
  input: MediaLibraryAssetInput,
): Promise<MediaLibraryAsset> {
  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: {
      kind: input.kind,
      url: input.url,
      altText: input.altText ?? null,
      thumbnailUrl: input.thumbnailUrl ?? null,
      label: input.label ?? null,
    },
  });

  return mapMediaAsset(asset);
}

export async function dbDeleteMediaAsset(id: string): Promise<void> {
  await prisma.mediaAsset.delete({
    where: { id },
  });
}
