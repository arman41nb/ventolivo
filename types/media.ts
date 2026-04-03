export interface MediaLibraryAsset {
  id: string;
  kind: "image" | "video";
  url: string;
  altText?: string;
  thumbnailUrl?: string;
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaLibraryAssetInput {
  kind: "image" | "video";
  url: string;
  altText?: string;
  thumbnailUrl?: string;
  label?: string;
}
