import path from "path";
import { slugify } from "@/lib/utils";

export interface StoredMediaFile {
  relativePath: string;
  label: string;
}

export interface UploadableMediaFile {
  name: string;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

export function getMediaFileExtension(file: UploadableMediaFile): string {
  const fileExtension = path.extname(file.name).toLowerCase();

  if (fileExtension) {
    return fileExtension;
  }

  return allowedMimeTypes.get(file.type) || ".png";
}

export function getMediaFileLabel(fileName: string): string {
  const baseName = path.parse(fileName).name.replace(/[-_]+/g, " ").trim();

  if (!baseName) {
    return "Uploaded image";
  }

  return baseName.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getStoredMediaFileName(file: UploadableMediaFile): string {
  const baseName = slugify(path.parse(file.name).name) || "image";
  return `${Date.now()}-${crypto.randomUUID()}-${baseName}${getMediaFileExtension(file)}`;
}
