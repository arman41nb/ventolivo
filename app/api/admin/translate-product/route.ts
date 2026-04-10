import { NextResponse } from "next/server";
import { z } from "zod";
import { autoTranslateProductFields } from "@/lib/libretranslate";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { enforceTranslationRateLimit } from "@/lib/rate-limit";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession } from "@/services/admin-auth";

const localeSchema = z
  .string()
  .trim()
  .refine((value) => isValidLocale(value), "Invalid locale");

const translateProductSchema = z.object({
  sourceLocale: localeSchema,
  targetLocales: z.array(localeSchema).min(1),
  fields: z.object({
    name: z.string().trim().min(1),
    tag: z.string().trim().min(1),
    description: z.string().trim().min(1),
    weight: z.string().trim().optional().default(""),
    ingredients: z.string().trim().optional().default(""),
  }),
});

export async function POST(request: Request) {
  const logContext = getRequestLogContext(request);
  const session = await getAdminSession();

  if (!session) {
    return withRequestId(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      logContext.requestId,
    );
  }

  const rateLimit = await enforceTranslationRateLimit(
    `${session.user.id}:${logContext.clientIp ?? "unknown"}`,
  );

  if (!rateLimit.allowed) {
    return withRequestId(
      NextResponse.json(
        { error: "Too many translation requests. Please try again later." },
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

  try {
    const body = await request.json();
    const result = translateProductSchema.safeParse(body);

    if (!result.success) {
      return withRequestId(
        NextResponse.json({ error: "Invalid translation request" }, { status: 400 }),
        logContext.requestId,
      );
    }

    const { translations, providers } = await autoTranslateProductFields({
      sourceLocale: result.data.sourceLocale as Locale,
      targetLocales: result.data.targetLocales as Locale[],
      fields: result.data.fields,
    });

    return withRequestId(NextResponse.json({ translations, providers }), logContext.requestId, {
      "x-rate-limit-limit": `${rateLimit.limit}`,
      "x-rate-limit-remaining": `${rateLimit.remaining}`,
    });
  } catch (error) {
    logError("api.admin.translate-product", error, {
      ...logContext,
      adminUserId: session.user.id,
    });

    return withRequestId(
      NextResponse.json(
        { error: "Translation service is currently unavailable" },
        { status: 500 },
      ),
      logContext.requestId,
    );
  }
}
