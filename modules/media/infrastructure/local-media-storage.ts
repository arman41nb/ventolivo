import { mkdir, writeFile } from "fs/promises";
import { rm } from "fs/promises";
import path from "path";
import { env } from "@/lib/env";
import {
  getMediaFileLabel,
  getStoredMediaFileName,
  type StoredMediaFile,
  type UploadableMediaFile,
} from "./media-file-helpers";

export function resolveLocalMediaUploadDirectory(): string {
  if (path.isAbsolute(env.MEDIA_LOCAL_UPLOAD_DIR)) {
    return env.MEDIA_LOCAL_UPLOAD_DIR;
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), env.MEDIA_LOCAL_UPLOAD_DIR);
}

function resolveStoredMediaFilePath(relativePath: string): string {
  const normalizedBasePath = env.MEDIA_PUBLIC_BASE_PATH.replace(/\/+$/, "");

  if (relativePath.startsWith(normalizedBasePath)) {
    const fileName = relativePath.slice(normalizedBasePath.length).replace(/^\/+/, "");
    return path.join(resolveLocalMediaUploadDirectory(), fileName);
  }

  const normalizedPath = relativePath.replace(/^\/+/, "");
  return path.join(/* turbopackIgnore: true */ process.cwd(), "public", normalizedPath);
}

export async function storeMediaFile(file: UploadableMediaFile): Promise<StoredMediaFile> {
  const uploadDirectory = resolveLocalMediaUploadDirectory();
  await mkdir(uploadDirectory, { recursive: true });

  const fileName = getStoredMediaFileName(file);
  const relativePath = `${env.MEDIA_PUBLIC_BASE_PATH.replace(/\/+$/, "")}/${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDirectory, fileName), fileBuffer);

  return {
    relativePath,
    label: getMediaFileLabel(file.name),
  };
}

export async function removeStoredMediaFile(relativePath: string): Promise<void> {
  await rm(resolveStoredMediaFilePath(relativePath), { force: true });
}
