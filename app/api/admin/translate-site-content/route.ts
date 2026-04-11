import { NextResponse } from "next/server";
import { z } from "zod";
import { autoTranslateTextFields, TranslationServiceError } from "@/lib/libretranslate";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { enforceTranslationRateLimit } from "@/lib/rate-limit";
import { siteContentLocaleSchema } from "@/lib/validations";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession } from "@/services/admin-auth";

const localeSchema = z
  .string()
  .trim()
  .refine((value) => isValidLocale(value), "Invalid locale");

const translateSiteContentSchema = z.object({
  sourceLocale: localeSchema,
  targetLocales: z.array(localeSchema).min(1),
  fields: siteContentLocaleSchema,
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
    const result = translateSiteContentSchema.safeParse(body);

    if (!result.success) {
      return withRequestId(
        NextResponse.json({ error: "Invalid translation request" }, { status: 400 }),
        logContext.requestId,
      );
    }

    const { translations, providers } = await autoTranslateTextFields({
      sourceLocale: result.data.sourceLocale as Locale,
      targetLocales: result.data.targetLocales as Locale[],
      fields: result.data.fields,
    });

    return withRequestId(NextResponse.json({ translations, providers }), logContext.requestId, {
      "x-rate-limit-limit": `${rateLimit.limit}`,
      "x-rate-limit-remaining": `${rateLimit.remaining}`,
    });
  } catch (error) {
    if (error instanceof TranslationServiceError) {
      console.warn(
        JSON.stringify({
          level: "warn",
          scope: "api.admin.translate-site-content",
          ...logContext,
          adminUserId: session.user.id,
          error: {
            name: error.name,
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        }),
      );

      return withRequestId(
        NextResponse.json(
          { error: error.message },
          { status: error.statusCode },
        ),
        logContext.requestId,
        error.statusCode === 429 ? { "retry-after": "60" } : undefined,
      );
    }

    logError("api.admin.translate-site-content", error, {
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
