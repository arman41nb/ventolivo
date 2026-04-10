import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { enforceMediaUploadRateLimit } from "@/lib/rate-limit";
import { isAuthenticatedAdminRequest } from "@/services/admin-auth";
import { uploadMediaFiles } from "@/services/media";
import { getSiteLocales } from "@/services/site-content";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const allowedMimeTypes = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function isFileUpload(value: FormDataEntryValue): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export async function POST(request: NextRequest) {
  const logContext = getRequestLogContext(request);
  const isAuthenticated = await isAuthenticatedAdminRequest(request);

  if (!isAuthenticated) {
    return withRequestId(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      logContext.requestId,
    );
  }

  const rateLimit = await enforceMediaUploadRateLimit(logContext.clientIp ?? "unknown");

  if (!rateLimit.allowed) {
    return withRequestId(
      NextResponse.json(
        { error: "Too many upload requests. Please try again later." },
        {
          status: 429,
          headers: {
            "retry-after": `${rateLimit.retryAfterSeconds}`,
          },
        },
      ),
      logContext.requestId,
      {
        "x-rate-limit-limit": `${rateLimit.limit}`,
        "x-rate-limit-remaining": `${rateLimit.remaining}`,
      },
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter(isFileUpload);

  if (files.length === 0) {
    return withRequestId(
      NextResponse.json({ error: "Select at least one image file." }, { status: 400 }),
      logContext.requestId,
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
      return NextResponse.json({ error: `${file.name} is larger than 10 MB.` }, { status: 400 });
    }
  }
  try {
    const assets = await uploadMediaFiles(files);

    const siteLocales = await getSiteLocales();

    for (const locale of siteLocales.map((siteLocale) => siteLocale.code)) {
      revalidatePath(`/${locale}/admin/media`);
      revalidatePath(`/${locale}/admin/site`);
      revalidatePath(`/${locale}/admin/products`);
    }

    return withRequestId(
      NextResponse.json({
        assets: assets.map((asset) => ({
          ...asset,
          createdAt: asset.createdAt.toISOString(),
          updatedAt: asset.updatedAt.toISOString(),
        })),
      }),
      logContext.requestId,
      {
        "x-rate-limit-limit": `${rateLimit.limit}`,
        "x-rate-limit-remaining": `${rateLimit.remaining}`,
      },
    );
  } catch (error) {
    logError("api.admin.media.upload", error, logContext);
    return withRequestId(
      NextResponse.json({ error: "Media upload failed" }, { status: 500 }),
      logContext.requestId,
    );
  }
}
