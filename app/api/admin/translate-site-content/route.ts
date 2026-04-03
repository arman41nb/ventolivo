import { NextResponse } from "next/server";
import { z } from "zod";
import { autoTranslateTextFields } from "@/lib/libretranslate";
import { siteContentLocaleSchema } from "@/lib/validations";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAdminSession } from "@/modules/admin-auth/server";

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
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = translateSiteContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid translation request" },
        { status: 400 },
      );
    }

    const { translations, providers } = await autoTranslateTextFields({
      sourceLocale: result.data.sourceLocale as Locale,
      targetLocales: result.data.targetLocales as Locale[],
      fields: result.data.fields,
    });

    return NextResponse.json({ translations, providers });
  } catch (error) {
    console.error("Site content auto-translation failed:", error);

    return NextResponse.json(
      { error: "Translation service is currently unavailable" },
      { status: 500 },
    );
  }
}
