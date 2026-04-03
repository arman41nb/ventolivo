import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticatedRequest } from "@/modules/admin-auth/session";
import { createMediaAsset } from "@/modules/media";
import { getSiteLocales } from "@/modules/site-content";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
]);

function getExtension(file: File): string {
  const fileExtension = path.extname(file.name).toLowerCase();

  if (fileExtension) {
    return fileExtension;
  }

  return allowedMimeTypes.get(file.type) || ".png";
}

function getLabel(fileName: string): string {
  const baseName = path.parse(fileName).name.replace(/[-_]+/g, " ").trim();

  if (!baseName) {
    return "Uploaded image";
  }

  return baseName.replace(/\b\w/g, (character) => character.toUpperCase());
}

function getFileName(file: File): string {
  const baseName = slugify(path.parse(file.name).name) || "image";
  return `${Date.now()}-${crypto.randomUUID()}-${baseName}${getExtension(file)}`;
}

function isFileUpload(value: FormDataEntryValue): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticatedRequest(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter(isFileUpload);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Select at least one image file." },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: `${file.name} is not a supported image format.` },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `${file.name} is larger than 10 MB.` },
        { status: 400 },
      );
    }
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "media",
  );

  await mkdir(uploadDirectory, { recursive: true });

  const assets = [];

  for (const file of files) {
    const fileName = getFileName(file);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const relativePath = `/uploads/media/${fileName}`;

    await writeFile(path.join(uploadDirectory, fileName), fileBuffer);

    const asset = await createMediaAsset({
      kind: "image",
      url: relativePath,
      altText: "",
      label: getLabel(file.name),
      thumbnailUrl: "",
    });

    assets.push(asset);
  }

  const siteLocales = await getSiteLocales();

  for (const locale of siteLocales.map((siteLocale) => siteLocale.code)) {
    revalidatePath(`/${locale}/admin/media`);
    revalidatePath(`/${locale}/admin/site`);
    revalidatePath(`/${locale}/admin/products`);
  }

  return NextResponse.json({
    assets: assets.map((asset) => ({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })),
  });
}
